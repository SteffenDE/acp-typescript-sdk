export const AGENT_METHODS = {
    authenticate: "authenticate",
    initialize: "initialize",
    session_cancel: "session/cancel",
    session_fork: "session/fork",
    session_list: "session/list",
    session_load: "session/load",
    session_new: "session/new",
    session_prompt: "session/prompt",
    session_set_mode: "session/set_mode",
    session_set_model: "session/set_model",
};
export const CLIENT_METHODS = {
    fs_read_text_file: "fs/read_text_file",
    fs_write_text_file: "fs/write_text_file",
    session_request_permission: "session/request_permission",
    session_update: "session/update",
    terminal_create: "terminal/create",
    terminal_kill: "terminal/kill",
    terminal_output: "terminal/output",
    terminal_release: "terminal/release",
    terminal_wait_for_exit: "terminal/wait_for_exit",
};
export const PROTOCOL_VERSION = 1;
import { z } from "zod";
/** @internal */
export const errorSchema = z.object({
    code: z.number(),
    data: z.record(z.unknown()).optional(),
    message: z.string(),
});
/** @internal */
export const sessionIdSchema = z.string();
/** @internal */
export const permissionOptionKindSchema = z.union([
    z.literal("allow_once"),
    z.literal("allow_always"),
    z.literal("reject_once"),
    z.literal("reject_always"),
]);
/** @internal */
export const permissionOptionIdSchema = z.string();
/** @internal */
export const diffSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    newText: z.string(),
    oldText: z.string().optional().nullable(),
    path: z.string(),
});
/** @internal */
export const terminalSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    terminalId: z.string(),
});
/** @internal */
export const roleSchema = z.union([z.literal("assistant"), z.literal("user")]);
/** @internal */
export const textResourceContentsSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    mimeType: z.string().optional().nullable(),
    text: z.string(),
    uri: z.string(),
});
/** @internal */
export const blobResourceContentsSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    blob: z.string(),
    mimeType: z.string().optional().nullable(),
    uri: z.string(),
});
/** @internal */
export const toolKindSchema = z.union([
    z.literal("read"),
    z.literal("edit"),
    z.literal("delete"),
    z.literal("move"),
    z.literal("search"),
    z.literal("execute"),
    z.literal("think"),
    z.literal("fetch"),
    z.literal("switch_mode"),
    z.literal("other"),
]);
/** @internal */
export const toolCallStatusSchema = z.union([
    z.literal("pending"),
    z.literal("in_progress"),
    z.literal("completed"),
    z.literal("failed"),
]);
/** @internal */
export const toolCallIdSchema = z.string();
/** @internal */
export const authenticateResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
});
/** @internal */
export const setSessionModeResponseSchema = z.object({
    _meta: z.unknown().optional(),
});
/** @internal */
export const setSessionModelResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
});
/** @internal */
export const extMethodResponseSchema = z.record(z.unknown());
/** @internal */
export const protocolVersionSchema = z.number();
/** @internal */
export const modelIdSchema = z.string();
/** @internal */
export const sessionModeIdSchema = z.string();
/** @internal */
export const stopReasonSchema = z.union([
    z.literal("end_turn"),
    z.literal("max_tokens"),
    z.literal("max_turn_requests"),
    z.literal("refusal"),
    z.literal("cancelled"),
]);
/** @internal */
export const currentModeUpdateSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    currentModeId: sessionModeIdSchema,
});
/** @internal */
export const planEntryPrioritySchema = z.union([
    z.literal("high"),
    z.literal("medium"),
    z.literal("low"),
]);
/** @internal */
export const planEntryStatusSchema = z.union([
    z.literal("pending"),
    z.literal("in_progress"),
    z.literal("completed"),
]);
/** @internal */
export const unstructuredCommandInputSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    hint: z.string(),
});
/** @internal */
export const authenticateRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    methodId: z.string(),
});
/** @internal */
export const listSessionsRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    cursor: z.string().optional().nullable(),
    cwd: z.string().optional().nullable(),
});
/** @internal */
export const forkSessionRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    sessionId: sessionIdSchema,
});
/** @internal */
export const setSessionModeRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    modeId: sessionModeIdSchema,
    sessionId: sessionIdSchema,
});
/** @internal */
export const setSessionModelRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    modelId: modelIdSchema,
    sessionId: sessionIdSchema,
});
/** @internal */
export const writeTextFileResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
});
/** @internal */
export const readTextFileResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    content: z.string(),
});
/** @internal */
export const createTerminalResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    terminalId: z.string(),
});
/** @internal */
export const releaseTerminalResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
});
/** @internal */
export const waitForTerminalExitResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    exitCode: z.number().optional().nullable(),
    signal: z.string().optional().nullable(),
});
/** @internal */
export const killTerminalCommandResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
});
/** @internal */
export const extMethodResponse1Schema = z.record(z.unknown());
/** @internal */
export const selectedPermissionOutcomeSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    optionId: permissionOptionIdSchema,
});
/** @internal */
export const cancelNotificationSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    sessionId: sessionIdSchema,
});
/** @internal */
export const writeTextFileRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    content: z.string(),
    path: z.string(),
    sessionId: sessionIdSchema,
});
/** @internal */
export const readTextFileRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    limit: z.number().optional().nullable(),
    line: z.number().optional().nullable(),
    path: z.string(),
    sessionId: sessionIdSchema,
});
/** @internal */
export const permissionOptionSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    kind: permissionOptionKindSchema,
    name: z.string(),
    optionId: permissionOptionIdSchema,
});
/** @internal */
export const toolCallLocationSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    line: z.number().optional().nullable(),
    path: z.string(),
});
/** @internal */
export const annotationsSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    audience: z.array(roleSchema).optional().nullable(),
    lastModified: z.string().optional().nullable(),
    priority: z.number().optional().nullable(),
});
/** @internal */
export const imageContentSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    annotations: annotationsSchema.optional().nullable(),
    data: z.string(),
    mimeType: z.string(),
    uri: z.string().optional().nullable(),
});
/** @internal */
export const audioContentSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    annotations: annotationsSchema.optional().nullable(),
    data: z.string(),
    mimeType: z.string(),
});
/** @internal */
export const resourceLinkSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    annotations: annotationsSchema.optional().nullable(),
    description: z.string().optional().nullable(),
    mimeType: z.string().optional().nullable(),
    name: z.string(),
    size: z.number().optional().nullable(),
    title: z.string().optional().nullable(),
    uri: z.string(),
});
/** @internal */
export const embeddedResourceResourceSchema = z.union([
    textResourceContentsSchema,
    blobResourceContentsSchema,
]);
/** @internal */
export const envVariableSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    name: z.string(),
    value: z.string(),
});
/** @internal */
export const terminalOutputRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    sessionId: sessionIdSchema,
    terminalId: z.string(),
});
/** @internal */
export const releaseTerminalRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    sessionId: sessionIdSchema,
    terminalId: z.string(),
});
/** @internal */
export const waitForTerminalExitRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    sessionId: sessionIdSchema,
    terminalId: z.string(),
});
/** @internal */
export const killTerminalCommandRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    sessionId: sessionIdSchema,
    terminalId: z.string(),
});
/** @internal */
export const implementationSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    name: z.string(),
    title: z.string().optional().nullable(),
    version: z.string(),
});
/** @internal */
export const authMethodSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    description: z.string().optional().nullable(),
    id: z.string(),
    name: z.string(),
});
/** @internal */
export const mcpCapabilitiesSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    http: z.boolean().optional(),
    sse: z.boolean().optional(),
});
/** @internal */
export const promptCapabilitiesSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    audio: z.boolean().optional(),
    embeddedContext: z.boolean().optional(),
    image: z.boolean().optional(),
});
/** @internal */
export const sessionForkCapabilitiesSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
});
/** @internal */
export const sessionListCapabilitiesSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
});
/** @internal */
export const modelInfoSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    description: z.string().optional().nullable(),
    modelId: modelIdSchema,
    name: z.string(),
});
/** @internal */
export const sessionModeSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    description: z.string().optional().nullable(),
    id: sessionModeIdSchema,
    name: z.string(),
});
/** @internal */
export const sessionModelStateSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    availableModels: z.array(modelInfoSchema),
    currentModelId: modelIdSchema,
});
/** @internal */
export const sessionModeStateSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    availableModes: z.array(sessionModeSchema),
    currentModeId: sessionModeIdSchema,
});
/** @internal */
export const sessionInfoSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    cwd: z.string(),
    sessionId: sessionIdSchema,
    title: z.string().optional().nullable(),
    updatedAt: z.string().optional().nullable(),
});
/** @internal */
export const forkSessionResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    models: sessionModelStateSchema.optional().nullable(),
    modes: sessionModeStateSchema.optional().nullable(),
    sessionId: sessionIdSchema,
});
/** @internal */
export const promptResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    stopReason: stopReasonSchema,
});
/** @internal */
export const planEntrySchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    content: z.string(),
    priority: planEntryPrioritySchema,
    status: planEntryStatusSchema,
});
/** @internal */
export const availableCommandInputSchema = unstructuredCommandInputSchema;
/** @internal */
export const fileSystemCapabilitySchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    readTextFile: z.boolean().optional(),
    writeTextFile: z.boolean().optional(),
});
/** @internal */
export const httpHeaderSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    name: z.string(),
    value: z.string(),
});
/** @internal */
export const mcpServerSseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    headers: z.array(httpHeaderSchema),
    name: z.string(),
    url: z.string(),
});
/** @internal */
export const mcpServerStdioSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    args: z.array(z.string()),
    command: z.string(),
    env: z.array(envVariableSchema),
    name: z.string(),
});
/** @internal */
export const requestPermissionOutcomeSchema = z.union([
    z.object({
        outcome: z.literal("cancelled"),
    }),
    selectedPermissionOutcomeSchema,
]);
/** @internal */
export const terminalExitStatusSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    exitCode: z.number().optional().nullable(),
    signal: z.string().optional().nullable(),
});
/** @internal */
export const createTerminalRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    args: z.array(z.string()).optional(),
    command: z.string(),
    cwd: z.string().optional().nullable(),
    env: z.array(envVariableSchema).optional(),
    outputByteLimit: z.number().optional().nullable(),
    sessionId: sessionIdSchema,
});
/** @internal */
export const textContentSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    annotations: annotationsSchema.optional().nullable(),
    text: z.string(),
});
/** @internal */
export const embeddedResourceSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    annotations: annotationsSchema.optional().nullable(),
    resource: embeddedResourceResourceSchema,
});
/** @internal */
export const newSessionResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    models: sessionModelStateSchema.optional().nullable(),
    modes: sessionModeStateSchema.optional().nullable(),
    sessionId: sessionIdSchema,
});
/** @internal */
export const loadSessionResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    models: sessionModelStateSchema.optional().nullable(),
    modes: sessionModeStateSchema.optional().nullable(),
});
/** @internal */
export const listSessionsResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    nextCursor: z.string().optional().nullable(),
    sessions: z.array(sessionInfoSchema),
});
/** @internal */
export const planSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    entries: z.array(planEntrySchema),
});
/** @internal */
export const clientNotificationSchema = z.union([
    cancelNotificationSchema,
    z.record(z.unknown()),
]);
/** @internal */
export const mcpServerHttpSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    headers: z.array(httpHeaderSchema),
    name: z.string(),
    url: z.string(),
});
/** @internal */
export const requestPermissionResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    outcome: requestPermissionOutcomeSchema,
});
/** @internal */
export const terminalOutputResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    exitStatus: terminalExitStatusSchema.optional().nullable(),
    output: z.string(),
    truncated: z.boolean(),
});
/** @internal */
export const contentBlockSchema = z.union([
    textContentSchema,
    imageContentSchema,
    audioContentSchema,
    resourceLinkSchema,
    embeddedResourceSchema,
]);
/** @internal */
export const sessionCapabilitiesSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    fork: sessionForkCapabilitiesSchema.optional().nullable(),
    list: sessionListCapabilitiesSchema.optional().nullable(),
});
/** @internal */
export const contentChunkSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    content: contentBlockSchema,
});
/** @internal */
export const availableCommandSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    description: z.string(),
    input: availableCommandInputSchema.optional().nullable(),
    name: z.string(),
});
/** @internal */
export const clientCapabilitiesSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    fs: fileSystemCapabilitySchema.optional(),
    terminal: z.boolean().optional(),
});
/** @internal */
export const mcpServerSchema = z.union([
    mcpServerHttpSchema,
    mcpServerSseSchema,
    mcpServerStdioSchema,
]);
/** @internal */
export const loadSessionRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    cwd: z.string(),
    mcpServers: z.array(mcpServerSchema),
    sessionId: sessionIdSchema,
});
/** @internal */
export const promptRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    prompt: z.array(contentBlockSchema),
    sessionId: sessionIdSchema,
});
/** @internal */
export const contentSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    content: contentBlockSchema,
});
/** @internal */
export const availableCommandsUpdateSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    availableCommands: z.array(availableCommandSchema),
});
/** @internal */
export const clientResponseSchema = z.union([
    writeTextFileResponseSchema,
    readTextFileResponseSchema,
    requestPermissionResponseSchema,
    createTerminalResponseSchema,
    terminalOutputResponseSchema,
    releaseTerminalResponseSchema,
    waitForTerminalExitResponseSchema,
    killTerminalCommandResponseSchema,
    extMethodResponse1Schema,
]);
/** @internal */
export const initializeRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    clientCapabilities: clientCapabilitiesSchema.optional(),
    clientInfo: implementationSchema.optional().nullable(),
    protocolVersion: protocolVersionSchema,
});
/** @internal */
export const newSessionRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    cwd: z.string(),
    mcpServers: z.array(mcpServerSchema),
});
/** @internal */
export const toolCallContentSchema = z.union([
    contentSchema,
    diffSchema,
    terminalSchema,
]);
/** @internal */
export const agentCapabilitiesSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    loadSession: z.boolean().optional(),
    mcpCapabilities: mcpCapabilitiesSchema.optional(),
    promptCapabilities: promptCapabilitiesSchema.optional(),
    sessionCapabilities: sessionCapabilitiesSchema.optional(),
});
/** @internal */
export const toolCallSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    content: z.array(toolCallContentSchema).optional(),
    kind: toolKindSchema.optional(),
    locations: z.array(toolCallLocationSchema).optional(),
    rawInput: z.record(z.unknown()).optional(),
    rawOutput: z.record(z.unknown()).optional(),
    status: toolCallStatusSchema.optional(),
    title: z.string(),
    toolCallId: toolCallIdSchema,
});
/** @internal */
export const initializeResponseSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    agentCapabilities: agentCapabilitiesSchema.optional(),
    agentInfo: implementationSchema.optional().nullable(),
    authMethods: z.array(authMethodSchema).optional(),
    protocolVersion: protocolVersionSchema,
});
/** @internal */
export const toolCallUpdateSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    content: z.array(toolCallContentSchema).optional().nullable(),
    kind: toolKindSchema.optional().nullable(),
    locations: z.array(toolCallLocationSchema).optional().nullable(),
    rawInput: z.record(z.unknown()).optional(),
    rawOutput: z.record(z.unknown()).optional(),
    status: toolCallStatusSchema.optional().nullable(),
    title: z.string().optional().nullable(),
    toolCallId: toolCallIdSchema,
});
/** @internal */
export const clientRequestSchema = z.union([
    initializeRequestSchema,
    authenticateRequestSchema,
    newSessionRequestSchema,
    loadSessionRequestSchema,
    listSessionsRequestSchema,
    forkSessionRequestSchema,
    setSessionModeRequestSchema,
    promptRequestSchema,
    setSessionModelRequestSchema,
    z.record(z.unknown()),
]);
/** @internal */
export const requestPermissionRequestSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    options: z.array(permissionOptionSchema),
    sessionId: sessionIdSchema,
    toolCall: toolCallUpdateSchema,
});
/** @internal */
export const sessionUpdateSchema = z.union([
    contentChunkSchema,
    toolCallSchema,
    toolCallUpdateSchema,
    planSchema,
    availableCommandsUpdateSchema,
    currentModeUpdateSchema,
]);
/** @internal */
export const agentRequestSchema = z.union([
    writeTextFileRequestSchema,
    readTextFileRequestSchema,
    requestPermissionRequestSchema,
    createTerminalRequestSchema,
    terminalOutputRequestSchema,
    releaseTerminalRequestSchema,
    waitForTerminalExitRequestSchema,
    killTerminalCommandRequestSchema,
    z.record(z.unknown()),
]);
/** @internal */
export const agentResponseSchema = z.union([
    initializeResponseSchema,
    authenticateResponseSchema,
    newSessionResponseSchema,
    loadSessionResponseSchema,
    listSessionsResponseSchema,
    forkSessionResponseSchema,
    setSessionModeResponseSchema,
    promptResponseSchema,
    setSessionModelResponseSchema,
    extMethodResponseSchema,
]);
/** @internal */
export const sessionNotificationSchema = z.object({
    _meta: z.record(z.unknown()).optional(),
    sessionId: sessionIdSchema,
    update: sessionUpdateSchema,
});
/** @internal */
export const clientOutgoingMessage1Schema = z.union([
    z.object({
        id: z.union([z.number(), z.string()]).nullable(),
        method: z.string(),
        params: clientRequestSchema.optional().nullable(),
    }),
    z.union([
        z.object({
            result: clientResponseSchema,
        }),
        z.object({
            error: errorSchema,
        }),
    ]),
    z.object({
        method: z.string(),
        params: clientNotificationSchema.optional().nullable(),
    }),
]);
/** @internal */
export const clientOutgoingMessageSchema = clientOutgoingMessage1Schema.and(z.object({
    jsonrpc: z.literal("2.0"),
}));
/** @internal */
export const agentNotificationSchema = z.union([
    sessionNotificationSchema,
    z.record(z.unknown()),
]);
/** @internal */
export const agentOutgoingMessage1Schema = z.union([
    z.object({
        id: z.union([z.number(), z.string()]).nullable(),
        method: z.string(),
        params: agentRequestSchema.optional().nullable(),
    }),
    z.union([
        z.object({
            result: agentResponseSchema,
        }),
        z.object({
            error: errorSchema,
        }),
    ]),
    z.object({
        method: z.string(),
        params: agentNotificationSchema.optional().nullable(),
    }),
]);
/** @internal */
export const agentOutgoingMessageSchema = agentOutgoingMessage1Schema.and(z.object({
    jsonrpc: z.literal("2.0"),
}));
/** @internal */
export const agentClientProtocolSchema = z.union([
    agentOutgoingMessageSchema,
    clientOutgoingMessageSchema,
]);
//# sourceMappingURL=schema.js.map