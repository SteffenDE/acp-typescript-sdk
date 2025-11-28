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
} as const;

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
} as const;

export const PROTOCOL_VERSION = 1;

import { z } from "zod";

export type AgentClientProtocol = AgentOutgoingMessage | ClientOutgoingMessage;
/**
 * A message (request, response, or notification) with `"jsonrpc": "2.0"` specified as
 * [required by JSON-RPC 2.0 Specification][1].
 *
 * [1]: https://www.jsonrpc.org/specification#compatibility
 */
export type AgentOutgoingMessage = AgentOutgoingMessage1 & {
  jsonrpc: "2.0";
};
export type AgentOutgoingMessage1 =
  | {
      /**
       * JSON RPC Request Id
       *
       * An identifier established by the Client that MUST contain a String, Number, or NULL value if included. If it is not included it is assumed to be a notification. The value SHOULD normally not be Null [1] and Numbers SHOULD NOT contain fractional parts [2]
       *
       * The Server MUST reply with the same value in the Response object if included. This member is used to correlate the context between the two objects.
       *
       * [1] The use of Null as a value for the id member in a Request object is discouraged, because this specification uses a value of Null for Responses with an unknown id. Also, because JSON-RPC 1.0 uses an id value of Null for Notifications this could cause confusion in handling.
       *
       * [2] Fractional parts may be problematic, since many decimal fractions cannot be represented exactly as binary fractions.
       */
      id: null | number | string;
      method: string;
      params?: AgentRequest | null;
    }
  | (
      | {
          result: unknown;
        }
      | {
          error: Error;
        }
    )
  | {
      method: string;
      params?: AgentNotification | null;
    };
/**
 * All possible requests that an agent can send to a client.
 *
 * This enum is used internally for routing RPC requests. You typically won't need
 * to use this directly - instead, use the methods on the [`Client`] trait.
 *
 * This enum encompasses all method calls from agent to client.
 */
/** @internal */
export type AgentRequest =
  | WriteTextFileRequest
  | ReadTextFileRequest
  | RequestPermissionRequest
  | CreateTerminalRequest
  | TerminalOutputRequest
  | ReleaseTerminalRequest
  | WaitForTerminalExitRequest
  | KillTerminalCommandRequest
  | {
      [k: string]: unknown;
    };
/**
 * A unique identifier for a conversation session between a client and agent.
 *
 * Sessions maintain their own context, conversation history, and state,
 * allowing multiple independent interactions with the same agent.
 *
 * See protocol docs: [Session ID](https://agentclientprotocol.com/protocol/session-setup#session-id)
 */
export type SessionId = string;
/**
 * The type of permission option being presented to the user.
 *
 * Helps clients choose appropriate icons and UI treatment.
 */
export type PermissionOptionKind =
  | "allow_once"
  | "allow_always"
  | "reject_once"
  | "reject_always";
/**
 * Unique identifier for a permission option.
 */
export type PermissionOptionId = string;
/**
 * Content produced by a tool call.
 *
 * Tool calls can produce different types of content including
 * standard content blocks (text, images) or file diffs.
 *
 * See protocol docs: [Content](https://agentclientprotocol.com/protocol/tool-calls#content)
 */
export type ToolCallContent = Content | Diff | Terminal;
/**
 * Content blocks represent displayable information in the Agent Client Protocol.
 *
 * They provide a structured way to handle various types of user-facing content—whether
 * it's text from language models, images for analysis, or embedded resources for context.
 *
 * Content blocks appear in:
 * - User prompts sent via `session/prompt`
 * - Language model output streamed through `session/update` notifications
 * - Progress updates and results from tool calls
 *
 * This structure is compatible with the Model Context Protocol (MCP), enabling
 * agents to seamlessly forward content from MCP tool outputs without transformation.
 *
 * See protocol docs: [Content](https://agentclientprotocol.com/protocol/content)
 */
export type ContentBlock =
  | TextContent
  | ImageContent
  | AudioContent
  | ResourceLink
  | EmbeddedResource;
/**
 * The sender or recipient of messages and data in a conversation.
 */
export type Role = "assistant" | "user";
/**
 * Resource content that can be embedded in a message.
 */
export type EmbeddedResourceResource =
  | TextResourceContents
  | BlobResourceContents;
/**
 * Categories of tools that can be invoked.
 *
 * Tool kinds help clients choose appropriate icons and optimize how they
 * display tool execution progress.
 *
 * See protocol docs: [Creating](https://agentclientprotocol.com/protocol/tool-calls#creating)
 */
export type ToolKind =
  | "read"
  | "edit"
  | "delete"
  | "move"
  | "search"
  | "execute"
  | "think"
  | "fetch"
  | "switch_mode"
  | "other";
/**
 * Execution status of a tool call.
 *
 * Tool calls progress through different statuses during their lifecycle.
 *
 * See protocol docs: [Status](https://agentclientprotocol.com/protocol/tool-calls#status)
 */
export type ToolCallStatus = "pending" | "in_progress" | "completed" | "failed";
/**
 * Unique identifier for a tool call within a session.
 */
export type ToolCallId = string;
/**
 * All possible notifications that an agent can send to a client.
 *
 * This enum is used internally for routing RPC notifications. You typically won't need
 * to use this directly - use the notification methods on the [`Client`] trait instead.
 *
 * Notifications do not expect a response.
 */
/** @internal */
export type AgentNotification =
  | SessionNotification
  | {
      [k: string]: unknown;
    };
/**
 * Different types of updates that can be sent during session processing.
 *
 * These updates provide real-time feedback about the agent's progress.
 *
 * See protocol docs: [Agent Reports Output](https://agentclientprotocol.com/protocol/prompt-turn#3-agent-reports-output)
 */
export type SessionUpdate =
  | ContentChunk
  | ToolCall
  | ToolCallUpdate
  | Plan
  | AvailableCommandsUpdate
  | CurrentModeUpdate;
/**
 * Priority levels for plan entries.
 *
 * Used to indicate the relative importance or urgency of different
 * tasks in the execution plan.
 * See protocol docs: [Plan Entries](https://agentclientprotocol.com/protocol/agent-plan#plan-entries)
 */
export type PlanEntryPriority = "high" | "medium" | "low";
/**
 * Status of a plan entry in the execution flow.
 *
 * Tracks the lifecycle of each task from planning through completion.
 * See protocol docs: [Plan Entries](https://agentclientprotocol.com/protocol/agent-plan#plan-entries)
 */
export type PlanEntryStatus = "pending" | "in_progress" | "completed";
/**
 * The input specification for a command.
 */
export type AvailableCommandInput = UnstructuredCommandInput;
/**
 * Unique identifier for a Session Mode.
 */
export type SessionModeId = string;
/**
 * A message (request, response, or notification) with `"jsonrpc": "2.0"` specified as
 * [required by JSON-RPC 2.0 Specification][1].
 *
 * [1]: https://www.jsonrpc.org/specification#compatibility
 */
export type ClientOutgoingMessage = ClientOutgoingMessage1 & {
  jsonrpc: "2.0";
};
export type ClientOutgoingMessage1 =
  | {
      /**
       * JSON RPC Request Id
       *
       * An identifier established by the Client that MUST contain a String, Number, or NULL value if included. If it is not included it is assumed to be a notification. The value SHOULD normally not be Null [1] and Numbers SHOULD NOT contain fractional parts [2]
       *
       * The Server MUST reply with the same value in the Response object if included. This member is used to correlate the context between the two objects.
       *
       * [1] The use of Null as a value for the id member in a Request object is discouraged, because this specification uses a value of Null for Responses with an unknown id. Also, because JSON-RPC 1.0 uses an id value of Null for Notifications this could cause confusion in handling.
       *
       * [2] Fractional parts may be problematic, since many decimal fractions cannot be represented exactly as binary fractions.
       */
      id: null | number | string;
      method: string;
      params?: ClientRequest | null;
    }
  | (
      | {
          result: unknown;
        }
      | {
          error: Error;
        }
    )
  | {
      method: string;
      params?: ClientNotification | null;
    };
/**
 * All possible requests that a client can send to an agent.
 *
 * This enum is used internally for routing RPC requests. You typically won't need
 * to use this directly - instead, use the methods on the [`Agent`] trait.
 *
 * This enum encompasses all method calls from client to agent.
 */
/** @internal */
export type ClientRequest =
  | InitializeRequest
  | AuthenticateRequest
  | NewSessionRequest
  | LoadSessionRequest
  | ListSessionsRequest
  | ForkSessionRequest
  | SetSessionModeRequest
  | PromptRequest
  | SetSessionModelRequest
  | {
      [k: string]: unknown;
    };
/**
 * Protocol version identifier.
 *
 * This version is only bumped for breaking changes.
 * Non-breaking changes should be introduced via capabilities.
 */
export type ProtocolVersion = number;
/**
 * Configuration for connecting to an MCP (Model Context Protocol) server.
 *
 * MCP servers provide tools and context that the agent can use when
 * processing prompts.
 *
 * See protocol docs: [MCP Servers](https://agentclientprotocol.com/protocol/session-setup#mcp-servers)
 */
export type McpServer = McpServerHttp | McpServerSse | McpServerStdio;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * A unique identifier for a model.
 */
export type ModelId = string;
/**
 * All possible notifications that a client can send to an agent.
 *
 * This enum is used internally for routing RPC notifications. You typically won't need
 * to use this directly - use the notification methods on the [`Agent`] trait instead.
 *
 * Notifications do not expect a response.
 */
/** @internal */
export type ClientNotification =
  | CancelNotification
  | {
      [k: string]: unknown;
    };

/**
 * Request to write content to a text file.
 *
 * Only available if the client supports the `fs.writeTextFile` capability.
 */
export interface WriteTextFileRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The text content to write to the file.
   */
  content: string;
  /**
   * Absolute path to the file to write.
   */
  path: string;
  /**
   * The session ID for this request.
   */
  sessionId: SessionId;
}
/**
 * Request to read content from a text file.
 *
 * Only available if the client supports the `fs.readTextFile` capability.
 */
export interface ReadTextFileRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Maximum number of lines to read.
   */
  limit?: number | null;
  /**
   * Line number to start reading from (1-based).
   */
  line?: number | null;
  /**
   * Absolute path to the file to read.
   */
  path: string;
  /**
   * The session ID for this request.
   */
  sessionId: SessionId;
}
/**
 * Request for user permission to execute a tool call.
 *
 * Sent when the agent needs authorization before performing a sensitive operation.
 *
 * See protocol docs: [Requesting Permission](https://agentclientprotocol.com/protocol/tool-calls#requesting-permission)
 */
export interface RequestPermissionRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Available permission options for the user to choose from.
   */
  options: PermissionOption[];
  /**
   * The session ID for this request.
   */
  sessionId: SessionId;
  /**
   * Details about the tool call requiring permission.
   */
  toolCall: ToolCallUpdate;
}
/**
 * An option presented to the user when requesting permission.
 */
export interface PermissionOption {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Hint about the nature of this permission option.
   */
  kind: PermissionOptionKind;
  /**
   * Human-readable label to display to the user.
   */
  name: string;
  /**
   * Unique identifier for this permission option.
   */
  optionId: PermissionOptionId;
}
/**
 * An update to an existing tool call.
 *
 * Used to report progress and results as tools execute. All fields except
 * the tool call ID are optional - only changed fields need to be included.
 *
 * See protocol docs: [Updating](https://agentclientprotocol.com/protocol/tool-calls#updating)
 */
export interface ToolCallUpdate {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Replace the content collection.
   */
  content?: ToolCallContent[] | null;
  /**
   * Update the tool kind.
   */
  kind?: ToolKind | null;
  /**
   * Replace the locations collection.
   */
  locations?: ToolCallLocation[] | null;
  /**
   * Update the raw input.
   */
  rawInput?: {
    [k: string]: unknown;
  };
  /**
   * Update the raw output.
   */
  rawOutput?: {
    [k: string]: unknown;
  };
  /**
   * Update the execution status.
   */
  status?: ToolCallStatus | null;
  /**
   * Update the human-readable title.
   */
  title?: string | null;
  /**
   * The ID of the tool call being updated.
   */
  toolCallId: ToolCallId;
}
/**
 * Standard content block (text, images, resources).
 */
export interface Content {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The actual content block.
   */
  content: ContentBlock;
}
/**
 * Text provided to or from an LLM.
 */
export interface TextContent {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  annotations?: Annotations | null;
  text: string;
}
/**
 * Optional annotations for the client. The client can use annotations to inform how objects are used or displayed
 */
export interface Annotations {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  audience?: Role[] | null;
  lastModified?: string | null;
  priority?: number | null;
}
/**
 * An image provided to or from an LLM.
 */
export interface ImageContent {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  annotations?: Annotations | null;
  data: string;
  mimeType: string;
  uri?: string | null;
}
/**
 * Audio provided to or from an LLM.
 */
export interface AudioContent {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  annotations?: Annotations | null;
  data: string;
  mimeType: string;
}
/**
 * A resource that the server is capable of reading, included in a prompt or tool call result.
 */
export interface ResourceLink {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  annotations?: Annotations | null;
  description?: string | null;
  mimeType?: string | null;
  name: string;
  size?: number | null;
  title?: string | null;
  uri: string;
}
/**
 * The contents of a resource, embedded into a prompt or tool call result.
 */
export interface EmbeddedResource {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  annotations?: Annotations | null;
  resource: EmbeddedResourceResource;
}
/**
 * Text-based resource contents.
 */
export interface TextResourceContents {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  mimeType?: string | null;
  text: string;
  uri: string;
}
/**
 * Binary resource contents.
 */
export interface BlobResourceContents {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  blob: string;
  mimeType?: string | null;
  uri: string;
}
/**
 * A diff representing file modifications.
 *
 * Shows changes to files in a format suitable for display in the client UI.
 *
 * See protocol docs: [Content](https://agentclientprotocol.com/protocol/tool-calls#content)
 */
export interface Diff {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The new content after modification.
   */
  newText: string;
  /**
   * The original content (None for new files).
   */
  oldText?: string | null;
  /**
   * The file path being modified.
   */
  path: string;
}
/**
 * Embed a terminal created with `terminal/create` by its id.
 *
 * The terminal must be added before calling `terminal/release`.
 *
 * See protocol docs: [Terminal](https://agentclientprotocol.com/protocol/terminals)
 */
export interface Terminal {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  terminalId: string;
}
/**
 * A file location being accessed or modified by a tool.
 *
 * Enables clients to implement "follow-along" features that track
 * which files the agent is working with in real-time.
 *
 * See protocol docs: [Following the Agent](https://agentclientprotocol.com/protocol/tool-calls#following-the-agent)
 */
export interface ToolCallLocation {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Optional line number within the file.
   */
  line?: number | null;
  /**
   * The file path being accessed or modified.
   */
  path: string;
}
/**
 * Request to create a new terminal and execute a command.
 */
export interface CreateTerminalRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Array of command arguments.
   */
  args?: string[];
  /**
   * The command to execute.
   */
  command: string;
  /**
   * Working directory for the command (absolute path).
   */
  cwd?: string | null;
  /**
   * Environment variables for the command.
   */
  env?: EnvVariable[];
  /**
   * Maximum number of output bytes to retain.
   *
   * When the limit is exceeded, the Client truncates from the beginning of the output
   * to stay within the limit.
   *
   * The Client MUST ensure truncation happens at a character boundary to maintain valid
   * string output, even if this means the retained output is slightly less than the
   * specified limit.
   */
  outputByteLimit?: number | null;
  /**
   * The session ID for this request.
   */
  sessionId: SessionId;
}
/**
 * An environment variable to set when launching an MCP server.
 */
export interface EnvVariable {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The name of the environment variable.
   */
  name: string;
  /**
   * The value to set for the environment variable.
   */
  value: string;
}
/**
 * Request to get the current output and status of a terminal.
 */
export interface TerminalOutputRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The session ID for this request.
   */
  sessionId: SessionId;
  /**
   * The ID of the terminal to get output from.
   */
  terminalId: string;
}
/**
 * Request to release a terminal and free its resources.
 */
export interface ReleaseTerminalRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The session ID for this request.
   */
  sessionId: SessionId;
  /**
   * The ID of the terminal to release.
   */
  terminalId: string;
}
/**
 * Request to wait for a terminal command to exit.
 */
export interface WaitForTerminalExitRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The session ID for this request.
   */
  sessionId: SessionId;
  /**
   * The ID of the terminal to wait for.
   */
  terminalId: string;
}
/**
 * Request to kill a terminal command without releasing the terminal.
 */
export interface KillTerminalCommandRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The session ID for this request.
   */
  sessionId: SessionId;
  /**
   * The ID of the terminal to kill.
   */
  terminalId: string;
}
/**
 * JSON-RPC error object.
 *
 * Represents an error that occurred during method execution, following the
 * JSON-RPC 2.0 error object specification with optional additional data.
 *
 * See protocol docs: [JSON-RPC Error Object](https://www.jsonrpc.org/specification#error_object)
 */
export interface Error {
  /**
   * A number indicating the error type that occurred.
   * This must be an integer as defined in the JSON-RPC specification.
   */
  code: number;
  /**
   * Optional primitive or structured value that contains additional information about the error.
   * This may include debugging information or context-specific details.
   */
  data?: {
    [k: string]: unknown;
  };
  /**
   * A string providing a short description of the error.
   * The message should be limited to a concise single sentence.
   */
  message: string;
}
/**
 * Notification containing a session update from the agent.
 *
 * Used to stream real-time progress and results during prompt processing.
 *
 * See protocol docs: [Agent Reports Output](https://agentclientprotocol.com/protocol/prompt-turn#3-agent-reports-output)
 */
export interface SessionNotification {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The ID of the session this update pertains to.
   */
  sessionId: SessionId;
  /**
   * The actual update content.
   */
  update: SessionUpdate;
}
/**
 * A streamed item of content
 */
export interface ContentChunk {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * A single item of content
   */
  content: ContentBlock;
}
/**
 * Represents a tool call that the language model has requested.
 *
 * Tool calls are actions that the agent executes on behalf of the language model,
 * such as reading files, executing code, or fetching data from external sources.
 *
 * See protocol docs: [Tool Calls](https://agentclientprotocol.com/protocol/tool-calls)
 */
export interface ToolCall {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Content produced by the tool call.
   */
  content?: ToolCallContent[];
  /**
   * The category of tool being invoked.
   * Helps clients choose appropriate icons and UI treatment.
   */
  kind?: ToolKind;
  /**
   * File locations affected by this tool call.
   * Enables "follow-along" features in clients.
   */
  locations?: ToolCallLocation[];
  /**
   * Raw input parameters sent to the tool.
   */
  rawInput?: {
    [k: string]: unknown;
  };
  /**
   * Raw output returned by the tool.
   */
  rawOutput?: {
    [k: string]: unknown;
  };
  /**
   * Current execution status of the tool call.
   */
  status?: ToolCallStatus;
  /**
   * Human-readable title describing what the tool is doing.
   */
  title: string;
  /**
   * Unique identifier for this tool call within the session.
   */
  toolCallId: ToolCallId;
}
/**
 * An execution plan for accomplishing complex tasks.
 *
 * Plans consist of multiple entries representing individual tasks or goals.
 * Agents report plans to clients to provide visibility into their execution strategy.
 * Plans can evolve during execution as the agent discovers new requirements or completes tasks.
 *
 * See protocol docs: [Agent Plan](https://agentclientprotocol.com/protocol/agent-plan)
 */
export interface Plan {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The list of tasks to be accomplished.
   *
   * When updating a plan, the agent must send a complete list of all entries
   * with their current status. The client replaces the entire plan with each update.
   */
  entries: PlanEntry[];
}
/**
 * A single entry in the execution plan.
 *
 * Represents a task or goal that the assistant intends to accomplish
 * as part of fulfilling the user's request.
 * See protocol docs: [Plan Entries](https://agentclientprotocol.com/protocol/agent-plan#plan-entries)
 */
export interface PlanEntry {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Human-readable description of what this task aims to accomplish.
   */
  content: string;
  /**
   * The relative importance of this task.
   * Used to indicate which tasks are most critical to the overall goal.
   */
  priority: PlanEntryPriority;
  /**
   * Current execution status of this task.
   */
  status: PlanEntryStatus;
}
/**
 * Available commands are ready or have changed
 */
export interface AvailableCommandsUpdate {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Commands the agent can execute
   */
  availableCommands: AvailableCommand[];
}
/**
 * Information about a command.
 */
export interface AvailableCommand {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Human-readable description of what the command does.
   */
  description: string;
  /**
   * Input for the command if required
   */
  input?: AvailableCommandInput | null;
  /**
   * Command name (e.g., `create_plan`, `research_codebase`).
   */
  name: string;
}
/**
 * All text that was typed after the command name is provided as input.
 */
export interface UnstructuredCommandInput {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * A hint to display when the input hasn't been provided yet
   */
  hint: string;
}
/**
 * The current mode of the session has changed
 *
 * See protocol docs: [Session Modes](https://agentclientprotocol.com/protocol/session-modes)
 */
export interface CurrentModeUpdate {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The ID of the current mode
   */
  currentModeId: SessionModeId;
}
/**
 * Request parameters for the initialize method.
 *
 * Sent by the client to establish connection and negotiate capabilities.
 *
 * See protocol docs: [Initialization](https://agentclientprotocol.com/protocol/initialization)
 */
export interface InitializeRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Capabilities supported by the client.
   */
  clientCapabilities?: ClientCapabilities;
  /**
   * Information about the Client name and version sent to the Agent.
   *
   * Note: in future versions of the protocol, this will be required.
   */
  clientInfo?: Implementation | null;
  /**
   * The latest protocol version supported by the client.
   */
  protocolVersion: ProtocolVersion;
}
/**
 * Capabilities supported by the client.
 *
 * Advertised during initialization to inform the agent about
 * available features and methods.
 *
 * See protocol docs: [Client Capabilities](https://agentclientprotocol.com/protocol/initialization#client-capabilities)
 */
export interface ClientCapabilities {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * File system capabilities supported by the client.
   * Determines which file operations the agent can request.
   */
  fs?: FileSystemCapability;
  /**
   * Whether the Client support all `terminal/*` methods.
   */
  terminal?: boolean;
}
/**
 * Filesystem capabilities supported by the client.
 * File system capabilities that a client may support.
 *
 * See protocol docs: [FileSystem](https://agentclientprotocol.com/protocol/initialization#filesystem)
 */
export interface FileSystemCapability {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Whether the Client supports `fs/read_text_file` requests.
   */
  readTextFile?: boolean;
  /**
   * Whether the Client supports `fs/write_text_file` requests.
   */
  writeTextFile?: boolean;
}
/**
 * Metadata about the implementation of the client or agent.
 * Describes the name and version of an MCP implementation, with an optional
 * title for UI representation.
 */
export interface Implementation {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Intended for programmatic or logical use, but can be used as a display
   * name fallback if title isn’t present.
   */
  name: string;
  /**
   * Intended for UI and end-user contexts — optimized to be human-readable
   * and easily understood.
   *
   * If not provided, the name should be used for display.
   */
  title?: string | null;
  /**
   * Version of the implementation. Can be displayed to the user or used
   * for debugging or metrics purposes. (e.g. "1.0.0").
   */
  version: string;
}
/**
 * Request parameters for the authenticate method.
 *
 * Specifies which authentication method to use.
 */
export interface AuthenticateRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The ID of the authentication method to use.
   * Must be one of the methods advertised in the initialize response.
   */
  methodId: string;
}
/**
 * Request parameters for creating a new session.
 *
 * See protocol docs: [Creating a Session](https://agentclientprotocol.com/protocol/session-setup#creating-a-session)
 */
export interface NewSessionRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The working directory for this session. Must be an absolute path.
   */
  cwd: string;
  /**
   * List of MCP (Model Context Protocol) servers the agent should connect to.
   */
  mcpServers: McpServer[];
}
/**
 * HTTP transport configuration for MCP.
 */
export interface McpServerHttp {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * HTTP headers to set when making requests to the MCP server.
   */
  headers: HttpHeader[];
  /**
   * Human-readable name identifying this MCP server.
   */
  name: string;
  /**
   * URL to the MCP server.
   */
  url: string;
}
/**
 * An HTTP header to set when making requests to the MCP server.
 */
export interface HttpHeader {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The name of the HTTP header.
   */
  name: string;
  /**
   * The value to set for the HTTP header.
   */
  value: string;
}
/**
 * SSE transport configuration for MCP.
 */
export interface McpServerSse {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * HTTP headers to set when making requests to the MCP server.
   */
  headers: HttpHeader[];
  /**
   * Human-readable name identifying this MCP server.
   */
  name: string;
  /**
   * URL to the MCP server.
   */
  url: string;
}
/**
 * Stdio transport configuration for MCP.
 */
export interface McpServerStdio {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Command-line arguments to pass to the MCP server.
   */
  args: string[];
  /**
   * Path to the MCP server executable.
   */
  command: string;
  /**
   * Environment variables to set when launching the MCP server.
   */
  env: EnvVariable[];
  /**
   * Human-readable name identifying this MCP server.
   */
  name: string;
}
/**
 * Request parameters for loading an existing session.
 *
 * Only available if the Agent supports the `loadSession` capability.
 *
 * See protocol docs: [Loading Sessions](https://agentclientprotocol.com/protocol/session-setup#loading-sessions)
 */
export interface LoadSessionRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The working directory for this session.
   */
  cwd: string;
  /**
   * List of MCP servers to connect to for this session.
   */
  mcpServers: McpServer[];
  /**
   * The ID of the session to load.
   */
  sessionId: SessionId;
}
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for listing existing sessions.
 *
 * Only available if the Agent supports the `listSessions` capability.
 */
export interface ListSessionsRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * Opaque cursor token from a previous response's nextCursor field for cursor-based pagination
   */
  cursor?: string | null;
  /**
   * Filter sessions by working directory. Must be an absolute path.
   */
  cwd?: string | null;
}
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for forking an existing session.
 *
 * Creates a new session based on the context of an existing one, allowing
 * operations like generating summaries without affecting the original session's history.
 *
 * Only available if the Agent supports the `session.fork` capability.
 */
export interface ForkSessionRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The ID of the session to fork.
   */
  sessionId: SessionId;
}
/**
 * Request parameters for setting a session mode.
 */
export interface SetSessionModeRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The ID of the mode to set.
   */
  modeId: SessionModeId;
  /**
   * The ID of the session to set the mode for.
   */
  sessionId: SessionId;
}
/**
 * Request parameters for sending a user prompt to the agent.
 *
 * Contains the user's message and any additional context.
 *
 * See protocol docs: [User Message](https://agentclientprotocol.com/protocol/prompt-turn#1-user-message)
 */
export interface PromptRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The blocks of content that compose the user's message.
   *
   * As a baseline, the Agent MUST support [`ContentBlock::Text`] and [`ContentBlock::ResourceLink`],
   * while other variants are optionally enabled via [`PromptCapabilities`].
   *
   * The Client MUST adapt its interface according to [`PromptCapabilities`].
   *
   * The client MAY include referenced pieces of context as either
   * [`ContentBlock::Resource`] or [`ContentBlock::ResourceLink`].
   *
   * When available, [`ContentBlock::Resource`] is preferred
   * as it avoids extra round-trips and allows the message to include
   * pieces of context from sources the agent may not have access to.
   */
  prompt: ContentBlock[];
  /**
   * The ID of the session to send this user message to
   */
  sessionId: SessionId;
}
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for setting a session model.
 */
export interface SetSessionModelRequest {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The ID of the model to set.
   */
  modelId: ModelId;
  /**
   * The ID of the session to set the model for.
   */
  sessionId: SessionId;
}
/**
 * Notification to cancel ongoing operations for a session.
 *
 * See protocol docs: [Cancellation](https://agentclientprotocol.com/protocol/prompt-turn#cancellation)
 */
export interface CancelNotification {
  /**
   * Extension point for implementations
   */
  _meta?: {
    [k: string]: unknown;
  };
  /**
   * The ID of the session to cancel operations for.
   */
  sessionId: SessionId;
}

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
export const sessionModeIdSchema = z.string();

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
export const protocolVersionSchema = z.number();

/** @internal */
export const modelIdSchema = z.string();

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
export const planEntrySchema = z.object({
  _meta: z.record(z.unknown()).optional(),
  content: z.string(),
  priority: planEntryPrioritySchema,
  status: planEntryStatusSchema,
});

/** @internal */
export const availableCommandInputSchema = unstructuredCommandInputSchema;

/** @internal */
export const currentModeUpdateSchema = z.object({
  _meta: z.record(z.unknown()).optional(),
  currentModeId: sessionModeIdSchema,
});

/** @internal */
export const implementationSchema = z.object({
  _meta: z.record(z.unknown()).optional(),
  name: z.string(),
  title: z.string().optional().nullable(),
  version: z.string(),
});

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
export const setSessionModelRequestSchema = z.object({
  _meta: z.record(z.unknown()).optional(),
  modelId: modelIdSchema,
  sessionId: sessionIdSchema,
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
export const contentBlockSchema = z.union([
  textContentSchema,
  imageContentSchema,
  audioContentSchema,
  resourceLinkSchema,
  embeddedResourceSchema,
]);

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
      result: z.unknown(),
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
export const clientOutgoingMessageSchema = clientOutgoingMessage1Schema.and(
  z.object({
    jsonrpc: z.literal("2.0"),
  }),
);

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
      result: z.unknown(),
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
export const agentOutgoingMessageSchema = agentOutgoingMessage1Schema.and(
  z.object({
    jsonrpc: z.literal("2.0"),
  }),
);

/** @internal */
export const agentClientProtocolSchema = z.union([
  agentOutgoingMessageSchema,
  clientOutgoingMessageSchema,
]);
