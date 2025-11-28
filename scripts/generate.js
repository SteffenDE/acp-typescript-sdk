#!/usr/bin/env node

import { compile } from "json-schema-to-typescript";
import { generate } from "ts-to-zod";
import * as fs from "fs/promises";
import { dirname } from "path";

const CURRENT_SCHEMA_RELEASE = "v0.6.3";

// await downloadSchemas(CURRENT_SCHEMA_RELEASE);

/**
 * Downloads a file from a URL to a local path
 * @param {string} url - The URL to download from
 * @param {string} outputPath - The local path to save the file
 */
async function downloadFile(url, outputPath) {
  await fs.mkdir(dirname(outputPath), { recursive: true });

  const response = await fetch(url);

  if (response.status === 302 || response.status === 301) {
    // Follow redirects
    await downloadFile(response.headers.location, outputPath);
    return;
  }

  if (response.status !== 200) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  await fs.writeFile(outputPath, response.body);
}

/**
 * Downloads schema files from a GitHub release
 * @param {string} tag - The GitHub release tag (e.g., "v0.5.0")
 */
async function downloadSchemas(tag) {
  const baseUrl = `https://github.com/agentclientprotocol/agent-client-protocol/releases/download/${tag}`;
  const files = [
    { url: `${baseUrl}/schema.json`, path: "./schema/schema.json" },
    { url: `${baseUrl}/meta.json`, path: "./schema/meta.json" },
  ];

  console.log(`Downloading schemas from release ${tag}...`);

  for (const file of files) {
    await downloadFile(file.url, file.path);
  }

  console.log("Schema files downloaded successfully\n");
}

/**
 * Preprocesses the JSON schema to fix issues with json-schema-to-typescript.
 *
 * Issues fixed:
 * 1. Empty objects {} in anyOf arrays - the library interprets {} as "any type",
 *    causing union types to collapse. We add titles to make them proper types.
 * 2. Discriminated unions with allOf[$ref] + properties - the library doesn't
 *    merge the discriminator property into the generated type. We flatten these
 *    by resolving refs and merging properties.
 */
function preprocessSchema(schema) {
  const defs = schema.$defs;
  if (!defs) return;

  // First pass: fix discriminated unions (oneOf with allOf + properties pattern)
  for (const [defName, def] of Object.entries(defs)) {
    if (def.oneOf && def.discriminator) {
      flattenDiscriminatedUnion(def, defs);
    }
  }

  // Second pass: fix empty objects and missing titles in anyOf
  for (const [defName, def] of Object.entries(defs)) {
    if (!def.anyOf) continue;

    for (let i = 0; i < def.anyOf.length; i++) {
      const item = def.anyOf[i];

      // Fix empty objects - add a title based on parent name
      if (Object.keys(item).length === 0) {
        const extTitle = defName.replace(/^(Agent|Client)/, "ExtMethod");
        item.title = extTitle;
        continue;
      }

      // Add title to $ref entries if missing
      if (item.$ref && !item.title) {
        const refName = item.$ref.split("/").pop();
        item.title = refName;
      }
    }
  }
}

/**
 * Flattens a discriminated union by resolving allOf refs and merging properties.
 *
 * Transforms:
 *   { allOf: [{ $ref: "#/$defs/Foo" }], properties: { disc: { const: "x" } } }
 * Into:
 *   { title: "...", type: "object", properties: { ...Foo.properties, disc: { const: "x" } }, required: [...] }
 */
function flattenDiscriminatedUnion(def, defs) {
  const discriminatorProp = def.discriminator.propertyName;

  for (let i = 0; i < def.oneOf.length; i++) {
    const variant = def.oneOf[i];

    // Skip if no allOf with $ref
    if (!variant.allOf || variant.allOf.length === 0) continue;

    const refEntry = variant.allOf.find((a) => a.$ref);
    if (!refEntry) continue;

    // Resolve the $ref
    const refName = refEntry.$ref.split("/").pop();
    const refDef = defs[refName];
    if (!refDef) continue;

    // Get discriminator value for title
    const discValue = variant.properties?.[discriminatorProp]?.const;
    const title =
      variant.title ||
      (discValue ? pascalCase(discValue) : `${refName}Variant`);

    // Merge properties from ref and variant
    const mergedProperties = {
      ...(refDef.properties || {}),
      ...(variant.properties || {}),
    };

    // Merge required fields
    const mergedRequired = [
      ...new Set([...(refDef.required || []), ...(variant.required || [])]),
    ];

    // Replace variant with flattened version
    def.oneOf[i] = {
      title,
      type: "object",
      properties: mergedProperties,
      required: mergedRequired,
    };

    // Copy description if present
    if (variant.description) {
      def.oneOf[i].description = variant.description;
    }
  }
}

function pascalCase(str) {
  return str
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

const jsonSchema = JSON.parse(
  await fs.readFile("./schema/schema.json", "utf8"),
);
const metadata = JSON.parse(await fs.readFile("./schema/meta.json", "utf8"));

preprocessSchema(jsonSchema);

const tsSrc = await compile(jsonSchema, "Agent Client Protocol", {
  additionalProperties: false,
  bannerComment: false,
});

const zodGenerator = generate({
  sourceText: tsSrc,
  bannerComment: false,
  keepComments: false,
});
const zodSchemas = zodGenerator.getZodSchemasFile();

const schemaTs = `
export const AGENT_METHODS = ${JSON.stringify(metadata.agentMethods, null, 2)} as const;

export const CLIENT_METHODS = ${JSON.stringify(metadata.clientMethods, null, 2)} as const;

export const PROTOCOL_VERSION = ${metadata.version};

import { z } from "zod";

${markSpecificTypesAsInternal(tsSrc)}

${markZodSchemasAsInternal(fixGeneratedZod(zodSchemas))}
`;

function fixGeneratedZod(src) {
  return src
    .replace(`// Generated by ts-to-zod\nimport { z } from "zod";\n`, "")
    .replace(`import * as generated from "./zod";\n`, "")
    .replace(/typeof generated./g, "typeof ");
}

function markSpecificTypesAsInternal(src) {
  const typesToExclude = [
    "AgentRequest",
    "AgentResponse",
    "AgentNotification",
    "ClientRequest",
    "ClientResponse",
    "ClientNotification",
  ];

  let result = src;

  for (const typeName of typesToExclude) {
    const regex = new RegExp(`(export type ${typeName}\\b)`, "g");
    result = result.replace(regex, "/** @internal */\n$1");
  }

  return result;
}

function markZodSchemasAsInternal(src) {
  // Mark all zod schemas as internal - they're implementation details
  return src.replace(/(export const \w+Schema = )/g, "/** @internal */\n$1");
}

await fs.writeFile("src/schema.ts", schemaTs, "utf8");
