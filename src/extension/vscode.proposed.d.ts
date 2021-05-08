/// <reference types="vscode" />
/**
 * This is the place for API experiments and proposals.
 * These API are NOT stable and subject to change. They are only available in the Insiders
 * distribution and CANNOT be used in published extensions.
 *
 * To test these API in local environment:
 * - Use Insiders release of VS Code.
 * - Add `"enableProposedApi": true` to your package.json.
 * - Copy this file to your project.
 */
declare module 'vscode' {
    /**
     * An {@link Event} which fires when an {@link AuthenticationProvider} is added or removed.
     */
    interface AuthenticationProvidersChangeEvent {
        /**
         * The ids of the {@link AuthenticationProvider}s that have been added.
         */
        readonly added: ReadonlyArray<AuthenticationProviderInformation>;
        /**
         * The ids of the {@link AuthenticationProvider}s that have been removed.
         */
        readonly removed: ReadonlyArray<AuthenticationProviderInformation>;
    }
    namespace authentication {
        /**
         * @deprecated - getSession should now trigger extension activation.
         * Fires with the provider id that was registered or unregistered.
         */
        const onDidChangeAuthenticationProviders: Event<AuthenticationProvidersChangeEvent>;
        /**
         * @deprecated
         * An array of the information of authentication providers that are currently registered.
         */
        const providers: ReadonlyArray<AuthenticationProviderInformation>;
        /**
         * @deprecated
         * Logout of a specific session.
         * @param providerId The id of the provider to use
         * @param sessionId The session id to remove
         * provider
         */
        function logout(providerId: string, sessionId: string): Thenable<void>;
    }
    interface MessageOptions {
        /**
         * Do not render a native message box.
         */
        useCustom?: boolean;
    }
    interface RemoteAuthorityResolverContext {
        resolveAttempt: number;
    }
    class ResolvedAuthority {
        readonly host: string;
        readonly port: number;
        readonly connectionToken: string | undefined;
        constructor(host: string, port: number, connectionToken?: string);
    }
    enum RemoteTrustOption {
        Unknown = 0,
        DisableTrust = 1,
        MachineTrusted = 2
    }
    interface ResolvedOptions {
        extensionHostEnv?: {
            [key: string]: string | null;
        };
        trust?: RemoteTrustOption;
    }
    interface TunnelOptions {
        remoteAddress: {
            port: number;
            host: string;
        };
        localAddressPort?: number;
        label?: string;
        public?: boolean;
    }
    interface TunnelDescription {
        remoteAddress: {
            port: number;
            host: string;
        };
        localAddress: {
            port: number;
            host: string;
        } | string;
        public?: boolean;
    }
    interface Tunnel extends TunnelDescription {
        onDidDispose: Event<void>;
        dispose(): void | Thenable<void>;
    }
    /**
     * Used as part of the ResolverResult if the extension has any candidate,
     * published, or forwarded ports.
     */
    interface TunnelInformation {
        /**
         * Tunnels that are detected by the extension. The remotePort is used for display purposes.
         * The localAddress should be the complete local address (ex. localhost:1234) for connecting to the port. Tunnels provided through
         * detected are read-only from the forwarded ports UI.
         */
        environmentTunnels?: TunnelDescription[];
    }
    interface TunnelCreationOptions {
        /**
         * True when the local operating system will require elevation to use the requested local port.
         */
        elevationRequired?: boolean;
    }
    enum CandidatePortSource {
        None = 0,
        Process = 1,
        Output = 2
    }
    type ResolverResult = ResolvedAuthority & ResolvedOptions & TunnelInformation;
    class RemoteAuthorityResolverError extends Error {
        static NotAvailable(message?: string, handled?: boolean): RemoteAuthorityResolverError;
        static TemporarilyNotAvailable(message?: string): RemoteAuthorityResolverError;
        constructor(message?: string);
    }
    interface RemoteAuthorityResolver {
        resolve(authority: string, context: RemoteAuthorityResolverContext): ResolverResult | Thenable<ResolverResult>;
        /**
         * Can be optionally implemented if the extension can forward ports better than the core.
         * When not implemented, the core will use its default forwarding logic.
         * When implemented, the core will use this to forward ports.
         *
         * To enable the "Change Local Port" action on forwarded ports, make sure to set the `localAddress` of
         * the returned `Tunnel` to a `{ port: number, host: string; }` and not a string.
         */
        tunnelFactory?: (tunnelOptions: TunnelOptions, tunnelCreationOptions: TunnelCreationOptions) => Thenable<Tunnel> | undefined;
        /**p
         * Provides filtering for candidate ports.
         */
        showCandidatePort?: (host: string, port: number, detail: string) => Thenable<boolean>;
        /**
         * Lets the resolver declare which tunnel factory features it supports.
         * UNDER DISCUSSION! MAY CHANGE SOON.
         */
        tunnelFeatures?: {
            elevation: boolean;
            public: boolean;
        };
        candidatePortSource?: CandidatePortSource;
    }
    namespace workspace {
        /**
         * Forwards a port. If the current resolver implements RemoteAuthorityResolver:forwardPort then that will be used to make the tunnel.
         * By default, openTunnel only support localhost; however, RemoteAuthorityResolver:tunnelFactory can be used to support other ips.
         *
         * @throws When run in an environment without a remote.
         *
         * @param tunnelOptions The `localPort` is a suggestion only. If that port is not available another will be chosen.
         */
        function openTunnel(tunnelOptions: TunnelOptions): Thenable<Tunnel>;
        /**
         * Gets an array of the currently available tunnels. This does not include environment tunnels, only tunnels that have been created by the user.
         * Note that these are of type TunnelDescription and cannot be disposed.
         */
        let tunnels: Thenable<TunnelDescription[]>;
        /**
         * Fired when the list of tunnels has changed.
         */
        const onDidChangeTunnels: Event<void>;
    }
    interface ResourceLabelFormatter {
        scheme: string;
        authority?: string;
        formatting: ResourceLabelFormatting;
    }
    interface ResourceLabelFormatting {
        label: string;
        separator: '/' | '\\' | '';
        tildify?: boolean;
        normalizeDriveLetter?: boolean;
        workspaceSuffix?: string;
        authorityPrefix?: string;
        stripPathStartingSeparator?: boolean;
    }
    namespace workspace {
        function registerRemoteAuthorityResolver(authorityPrefix: string, resolver: RemoteAuthorityResolver): Disposable;
        function registerResourceLabelFormatter(formatter: ResourceLabelFormatter): Disposable;
    }
    interface WebviewEditorInset {
        readonly editor: TextEditor;
        readonly line: number;
        readonly height: number;
        readonly webview: Webview;
        readonly onDidDispose: Event<void>;
        dispose(): void;
    }
    namespace window {
        function createWebviewTextEditorInset(editor: TextEditor, line: number, height: number, options?: WebviewOptions): WebviewEditorInset;
    }
    interface FileSystemProvider {
        open?(resource: Uri, options: {
            create: boolean;
        }): number | Thenable<number>;
        close?(fd: number): void | Thenable<void>;
        read?(fd: number, pos: number, data: Uint8Array, offset: number, length: number): number | Thenable<number>;
        write?(fd: number, pos: number, data: Uint8Array, offset: number, length: number): number | Thenable<number>;
    }
    /**
     * The parameters of a query for text search.
     */
    interface TextSearchQuery {
        /**
         * The text pattern to search for.
         */
        pattern: string;
        /**
         * Whether or not `pattern` should match multiple lines of text.
         */
        isMultiline?: boolean;
        /**
         * Whether or not `pattern` should be interpreted as a regular expression.
         */
        isRegExp?: boolean;
        /**
         * Whether or not the search should be case-sensitive.
         */
        isCaseSensitive?: boolean;
        /**
         * Whether or not to search for whole word matches only.
         */
        isWordMatch?: boolean;
    }
    /**
     * A file glob pattern to match file paths against.
     * TODO@roblourens merge this with the GlobPattern docs/definition in vscode.d.ts.
     * @see {@link GlobPattern}
     */
    type GlobString = string;
    /**
     * Options common to file and text search
     */
    interface SearchOptions {
        /**
         * The root folder to search within.
         */
        folder: Uri;
        /**
         * Files that match an `includes` glob pattern should be included in the search.
         */
        includes: GlobString[];
        /**
         * Files that match an `excludes` glob pattern should be excluded from the search.
         */
        excludes: GlobString[];
        /**
         * Whether external files that exclude files, like .gitignore, should be respected.
         * See the vscode setting `"search.useIgnoreFiles"`.
         */
        useIgnoreFiles: boolean;
        /**
         * Whether symlinks should be followed while searching.
         * See the vscode setting `"search.followSymlinks"`.
         */
        followSymlinks: boolean;
        /**
         * Whether global files that exclude files, like .gitignore, should be respected.
         * See the vscode setting `"search.useGlobalIgnoreFiles"`.
         */
        useGlobalIgnoreFiles: boolean;
    }
    /**
     * Options to specify the size of the result text preview.
     * These options don't affect the size of the match itself, just the amount of preview text.
     */
    interface TextSearchPreviewOptions {
        /**
         * The maximum number of lines in the preview.
         * Only search providers that support multiline search will ever return more than one line in the match.
         */
        matchLines: number;
        /**
         * The maximum number of characters included per line.
         */
        charsPerLine: number;
    }
    /**
     * Options that apply to text search.
     */
    interface TextSearchOptions extends SearchOptions {
        /**
         * The maximum number of results to be returned.
         */
        maxResults: number;
        /**
         * Options to specify the size of the result text preview.
         */
        previewOptions?: TextSearchPreviewOptions;
        /**
         * Exclude files larger than `maxFileSize` in bytes.
         */
        maxFileSize?: number;
        /**
         * Interpret files using this encoding.
         * See the vscode setting `"files.encoding"`
         */
        encoding?: string;
        /**
         * Number of lines of context to include before each match.
         */
        beforeContext?: number;
        /**
         * Number of lines of context to include after each match.
         */
        afterContext?: number;
    }
    /**
     * Represents the severiry of a TextSearchComplete message.
     */
    enum TextSearchCompleteMessageType {
        Information = 1,
        Warning = 2
    }
    /**
     * Information collected when text search is complete.
     */
    interface TextSearchComplete {
        /**
         * Whether the search hit the limit on the maximum number of search results.
         * `maxResults` on {@link TextSearchOptions `TextSearchOptions`} specifies the max number of results.
         * - If exactly that number of matches exist, this should be false.
         * - If `maxResults` matches are returned and more exist, this should be true.
         * - If search hits an internal limit which is less than `maxResults`, this should be true.
         */
        limitHit?: boolean;
        /**
         * Additional information regarding the state of the completed search.
         *
         * Messages with "Information" tyle support links in markdown syntax:
         * - Click to [run a command](command:workbench.action.OpenQuickPick)
         * - Click to [open a website](https://aka.ms)
         */
        message?: {
            text: string;
            type: TextSearchCompleteMessageType;
        } | {
            text: string;
            type: TextSearchCompleteMessageType;
        }[];
    }
    /**
     * A preview of the text result.
     */
    interface TextSearchMatchPreview {
        /**
         * The matching lines of text, or a portion of the matching line that contains the match.
         */
        text: string;
        /**
         * The Range within `text` corresponding to the text of the match.
         * The number of matches must match the TextSearchMatch's range property.
         */
        matches: Range | Range[];
    }
    /**
     * A match from a text search
     */
    interface TextSearchMatch {
        /**
         * The uri for the matching document.
         */
        uri: Uri;
        /**
         * The range of the match within the document, or multiple ranges for multiple matches.
         */
        ranges: Range | Range[];
        /**
         * A preview of the text match.
         */
        preview: TextSearchMatchPreview;
    }
    /**
     * A line of context surrounding a TextSearchMatch.
     */
    interface TextSearchContext {
        /**
         * The uri for the matching document.
         */
        uri: Uri;
        /**
         * One line of text.
         * previewOptions.charsPerLine applies to this
         */
        text: string;
        /**
         * The line number of this line of context.
         */
        lineNumber: number;
    }
    type TextSearchResult = TextSearchMatch | TextSearchContext;
    /**
     * A TextSearchProvider provides search results for text results inside files in the workspace.
     */
    interface TextSearchProvider {
        /**
         * Provide results that match the given text pattern.
         * @param query The parameters for this query.
         * @param options A set of options to consider while searching.
         * @param progress A progress callback that must be invoked for all results.
         * @param token A cancellation token.
         */
        provideTextSearchResults(query: TextSearchQuery, options: TextSearchOptions, progress: Progress<TextSearchResult>, token: CancellationToken): ProviderResult<TextSearchComplete>;
    }
    /**
     * The parameters of a query for file search.
     */
    interface FileSearchQuery {
        /**
         * The search pattern to match against file paths.
         */
        pattern: string;
    }
    /**
     * Options that apply to file search.
     */
    interface FileSearchOptions extends SearchOptions {
        /**
         * The maximum number of results to be returned.
         */
        maxResults?: number;
        /**
         * A CancellationToken that represents the session for this search query. If the provider chooses to, this object can be used as the key for a cache,
         * and searches with the same session object can search the same cache. When the token is cancelled, the session is complete and the cache can be cleared.
         */
        session?: CancellationToken;
    }
    /**
     * A FileSearchProvider provides search results for files in the given folder that match a query string. It can be invoked by quickopen or other extensions.
     *
     * A FileSearchProvider is the more powerful of two ways to implement file search in VS Code. Use a FileSearchProvider if you wish to search within a folder for
     * all files that match the user's query.
     *
     * The FileSearchProvider will be invoked on every keypress in quickopen. When `workspace.findFiles` is called, it will be invoked with an empty query string,
     * and in that case, every file in the folder should be returned.
     */
    interface FileSearchProvider {
        /**
         * Provide the set of files that match a certain file path pattern.
         * @param query The parameters for this query.
         * @param options A set of options to consider while searching files.
         * @param token A cancellation token.
         */
        provideFileSearchResults(query: FileSearchQuery, options: FileSearchOptions, token: CancellationToken): ProviderResult<Uri[]>;
    }
    namespace workspace {
        /**
         * Register a search provider.
         *
         * Only one provider can be registered per scheme.
         *
         * @param scheme The provider will be invoked for workspace folders that have this file scheme.
         * @param provider The provider.
         * @return A {@link Disposable} that unregisters this provider when being disposed.
         */
        function registerFileSearchProvider(scheme: string, provider: FileSearchProvider): Disposable;
        /**
         * Register a text search provider.
         *
         * Only one provider can be registered per scheme.
         *
         * @param scheme The provider will be invoked for workspace folders that have this file scheme.
         * @param provider The provider.
         * @return A {@link Disposable} that unregisters this provider when being disposed.
         */
        function registerTextSearchProvider(scheme: string, provider: TextSearchProvider): Disposable;
    }
    /**
     * Options that can be set on a findTextInFiles search.
     */
    interface FindTextInFilesOptions {
        /**
         * A {@link GlobPattern glob pattern} that defines the files to search for. The glob pattern
         * will be matched against the file paths of files relative to their workspace. Use a {@link RelativePattern relative pattern}
         * to restrict the search results to a {@link WorkspaceFolder workspace folder}.
         */
        include?: GlobPattern;
        /**
         * A {@link GlobPattern glob pattern} that defines files and folders to exclude. The glob pattern
         * will be matched against the file paths of resulting matches relative to their workspace. When `undefined`, default excludes will
         * apply.
         */
        exclude?: GlobPattern;
        /**
         * Whether to use the default and user-configured excludes. Defaults to true.
         */
        useDefaultExcludes?: boolean;
        /**
         * The maximum number of results to search for
         */
        maxResults?: number;
        /**
         * Whether external files that exclude files, like .gitignore, should be respected.
         * See the vscode setting `"search.useIgnoreFiles"`.
         */
        useIgnoreFiles?: boolean;
        /**
         * Whether global files that exclude files, like .gitignore, should be respected.
         * See the vscode setting `"search.useGlobalIgnoreFiles"`.
         */
        useGlobalIgnoreFiles?: boolean;
        /**
         * Whether symlinks should be followed while searching.
         * See the vscode setting `"search.followSymlinks"`.
         */
        followSymlinks?: boolean;
        /**
         * Interpret files using this encoding.
         * See the vscode setting `"files.encoding"`
         */
        encoding?: string;
        /**
         * Options to specify the size of the result text preview.
         */
        previewOptions?: TextSearchPreviewOptions;
        /**
         * Number of lines of context to include before each match.
         */
        beforeContext?: number;
        /**
         * Number of lines of context to include after each match.
         */
        afterContext?: number;
    }
    namespace workspace {
        /**
         * Search text in files across all {@link workspace.workspaceFolders workspace folders} in the workspace.
         * @param query The query parameters for the search - the search string, whether it's case-sensitive, or a regex, or matches whole words.
         * @param callback A callback, called for each result
         * @param token A token that can be used to signal cancellation to the underlying search engine.
         * @return A thenable that resolves when the search is complete.
         */
        function findTextInFiles(query: TextSearchQuery, callback: (result: TextSearchResult) => void, token?: CancellationToken): Thenable<TextSearchComplete>;
        /**
         * Search text in files across all {@link workspace.workspaceFolders workspace folders} in the workspace.
         * @param query The query parameters for the search - the search string, whether it's case-sensitive, or a regex, or matches whole words.
         * @param options An optional set of query options. Include and exclude patterns, maxResults, etc.
         * @param callback A callback, called for each result
         * @param token A token that can be used to signal cancellation to the underlying search engine.
         * @return A thenable that resolves when the search is complete.
         */
        function findTextInFiles(query: TextSearchQuery, options: FindTextInFilesOptions, callback: (result: TextSearchResult) => void, token?: CancellationToken): Thenable<TextSearchComplete>;
    }
    /**
     * The contiguous set of modified lines in a diff.
     */
    interface LineChange {
        readonly originalStartLineNumber: number;
        readonly originalEndLineNumber: number;
        readonly modifiedStartLineNumber: number;
        readonly modifiedEndLineNumber: number;
    }
    namespace commands {
        /**
         * Registers a diff information command that can be invoked via a keyboard shortcut,
         * a menu item, an action, or directly.
         *
         * Diff information commands are different from ordinary {@link commands.registerCommand commands} as
         * they only execute when there is an active diff editor when the command is called, and the diff
         * information has been computed. Also, the command handler of an editor command has access to
         * the diff information.
         *
         * @param command A unique identifier for the command.
         * @param callback A command handler function with access to the {@link LineChange diff information}.
         * @param thisArg The `this` context used when invoking the handler function.
         * @return Disposable which unregisters this command on disposal.
         */
        function registerDiffInformationCommand(command: string, callback: (diff: LineChange[], ...args: any[]) => any, thisArg?: any): Disposable;
    }
    /**
     * A DebugProtocolVariableContainer is an opaque stand-in type for the intersection of the Scope and Variable types defined in the Debug Adapter Protocol.
     * See https://microsoft.github.io/debug-adapter-protocol/specification#Types_Scope and https://microsoft.github.io/debug-adapter-protocol/specification#Types_Variable.
     */
    interface DebugProtocolVariableContainer {
    }
    /**
     * A DebugProtocolVariable is an opaque stand-in type for the Variable type defined in the Debug Adapter Protocol.
     * See https://microsoft.github.io/debug-adapter-protocol/specification#Types_Variable.
     */
    interface DebugProtocolVariable {
    }
    /**
     * Represents the validation type of the Source Control input.
     */
    enum SourceControlInputBoxValidationType {
        /**
         * Something not allowed by the rules of a language or other means.
         */
        Error = 0,
        /**
         * Something suspicious but allowed.
         */
        Warning = 1,
        /**
         * Something to inform about but not a problem.
         */
        Information = 2
    }
    interface SourceControlInputBoxValidation {
        /**
         * The validation message to display.
         */
        readonly message: string;
        /**
         * The validation type.
         */
        readonly type: SourceControlInputBoxValidationType;
    }
    /**
     * Represents the input box in the Source Control viewlet.
     */
    interface SourceControlInputBox {
        /**
         * Shows a transient contextual message on the input.
         */
        showValidationMessage(message: string, type: SourceControlInputBoxValidationType): void;
        /**
         * A validation function for the input box. It's possible to change
         * the validation provider simply by setting this property to a different function.
         */
        validateInput?(value: string, cursorPosition: number): ProviderResult<SourceControlInputBoxValidation>;
    }
    interface SourceControl {
        /**
         * Whether the source control is selected.
         */
        readonly selected: boolean;
        /**
         * An event signaling when the selection state changes.
         */
        readonly onDidChangeSelection: Event<boolean>;
    }
    interface TerminalDataWriteEvent {
        /**
         * The {@link Terminal} for which the data was written.
         */
        readonly terminal: Terminal;
        /**
         * The data being written.
         */
        readonly data: string;
    }
    namespace window {
        /**
         * An event which fires when the terminal's child pseudo-device is written to (the shell).
         * In other words, this provides access to the raw data stream from the process running
         * within the terminal, including VT sequences.
         */
        const onDidWriteTerminalData: Event<TerminalDataWriteEvent>;
    }
    /**
     * An {@link Event} which fires when a {@link Terminal}'s dimensions change.
     */
    interface TerminalDimensionsChangeEvent {
        /**
         * The {@link Terminal} for which the dimensions have changed.
         */
        readonly terminal: Terminal;
        /**
         * The new value for the {@link Terminal.dimensions terminal's dimensions}.
         */
        readonly dimensions: TerminalDimensions;
    }
    namespace window {
        /**
         * An event which fires when the {@link Terminal.dimensions dimensions} of the terminal change.
         */
        const onDidChangeTerminalDimensions: Event<TerminalDimensionsChangeEvent>;
    }
    interface Terminal {
        /**
         * The current dimensions of the terminal. This will be `undefined` immediately after the
         * terminal is created as the dimensions are not known until shortly after the terminal is
         * created.
         */
        readonly dimensions: TerminalDimensions | undefined;
    }
    interface Pseudoterminal {
        /**
         * An event that when fired allows changing the name of the terminal.
         *
         * **Example:** Change the terminal name to "My new terminal".
         * ```typescript
         * const writeEmitter = new vscode.EventEmitter<string>();
         * const changeNameEmitter = new vscode.EventEmitter<string>();
         * const pty: vscode.Pseudoterminal = {
         *   onDidWrite: writeEmitter.event,
         *   onDidChangeName: changeNameEmitter.event,
         *   open: () => changeNameEmitter.fire('My new terminal'),
         *   close: () => {}
         * };
         * vscode.window.createTerminal({ name: 'My terminal', pty });
         * ```
         */
        onDidChangeName?: Event<string>;
    }
    interface TerminalOptions {
        /**
         * A codicon ID to associate with this terminal.
         */
        readonly icon?: string;
    }
    interface DocumentFilter {
        readonly exclusive?: boolean;
    }
    interface TreeView<T> extends Disposable {
        reveal(element: T | undefined, options?: {
            select?: boolean;
            focus?: boolean;
            expand?: boolean | number;
        }): Thenable<void>;
    }
    interface TreeViewOptions<T> {
        /**
         * * Whether the tree supports drag and drop.
         */
        canDragAndDrop?: boolean;
    }
    interface TreeDataProvider<T> {
        /**
         * Optional method to reparent an `element`.
         *
         * **NOTE:**  This method should be implemented if the tree supports drag and drop.
         *
         * @param elements The selected elements that will be reparented.
         * @param targetElement The new parent of the elements.
         */
        setParent?(elements: T[], targetElement: T): Thenable<void>;
    }
    interface TaskPresentationOptions {
        /**
         * Controls whether the task is executed in a specific terminal group using split panes.
         */
        group?: string;
    }
    /**
     * Options to configure the status bar item.
     */
    interface StatusBarItemOptions {
        /**
         * A unique identifier of the status bar item. The identifier
         * is for example used to allow a user to show or hide the
         * status bar item in the UI.
         */
        id: string;
        /**
         * A human readable name of the status bar item. The name is
         * for example used as a label in the UI to show or hide the
         * status bar item.
         */
        name: string;
        /**
         * Accessibility information used when screen reader interacts with this status bar item.
         */
        accessibilityInformation?: AccessibilityInformation;
        /**
         * The alignment of the status bar item.
         */
        alignment?: StatusBarAlignment;
        /**
         * The priority of the status bar item. Higher value means the item should
         * be shown more to the left.
         */
        priority?: number;
    }
    namespace window {
        /**
         * Creates a status bar {@link StatusBarItem item}.
         *
         * @param options The options of the item. If not provided, some default values
         * will be assumed. For example, the `StatusBarItemOptions.id` will be the id
         * of the extension and the `StatusBarItemOptions.name` will be the extension name.
         * @return A new status bar item.
         */
        function createStatusBarItem(options?: StatusBarItemOptions): StatusBarItem;
    }
    interface CustomTextEditorProvider {
        /**
         * Handle when the underlying resource for a custom editor is renamed.
         *
         * This allows the webview for the editor be preserved throughout the rename. If this method is not implemented,
         * VS Code will destory the previous custom editor and create a replacement one.
         *
         * @param newDocument New text document to use for the custom editor.
         * @param existingWebviewPanel Webview panel for the custom editor.
         * @param token A cancellation token that indicates the result is no longer needed.
         *
         * @return Thenable indicating that the webview editor has been moved.
         */
        moveCustomTextEditor?(newDocument: TextDocument, existingWebviewPanel: WebviewPanel, token: CancellationToken): Thenable<void>;
    }
    interface QuickPick<T extends QuickPickItem> extends QuickInput {
        /**
         * An optional flag to sort the final results by index of first query match in label. Defaults to true.
         */
        sortByLabel: boolean;
    }
    enum NotebookCellKind {
        Markdown = 1,
        Code = 2
    }
    interface NotebookCell {
        /**
         * The index of this cell in its {@link NotebookDocument.cellAt containing notebook}. The
         * index is updated when a cell is moved within its notebook. The index is `-1`
         * when the cell has been removed from its notebook.
         */
        readonly index: number;
        /**
         * The {@link NotebookDocument notebook} that contains this cell.
         */
        readonly notebook: NotebookDocument;
        /**
         * The kind of this cell.
         */
        readonly kind: NotebookCellKind;
        /**
         * The {@link TextDocument text} of this cell, represented as text document.
         */
        readonly document: TextDocument;
        /**
         * The metadata of this cell.
         */
        readonly metadata: NotebookCellMetadata;
        /**
         * The outputs of this cell.
         */
        readonly outputs: ReadonlyArray<NotebookCellOutput>;
        readonly latestExecutionSummary: NotebookCellExecutionSummary | undefined;
    }
    /**
     * Represents a notebook which itself is a sequence of {@link NotebookCell code or markup cells}. Notebook documents are
     * created from {@link NotebookData notebook data}.
     */
    interface NotebookDocument {
        /**
         * The associated uri for this notebook.
         *
         * *Note* that most notebooks use the `file`-scheme, which means they are files on disk. However, **not** all notebooks are
         * saved on disk and therefore the `scheme` must be checked before trying to access the underlying file or siblings on disk.
         *
         * @see {@link FileSystemProvider}
         * @see {@link TextDocumentContentProvider}
         */
        readonly uri: Uri;
        readonly viewType: string;
        /**
         * The version number of this notebook (it will strictly increase after each
         * change, including undo/redo).
         */
        readonly version: number;
        /**
         * `true` if there are unpersisted changes.
         */
        readonly isDirty: boolean;
        /**
         * Is this notebook representing an untitled file which has not been saved yet.
         */
        readonly isUntitled: boolean;
        /**
         * `true` if the notebook has been closed. A closed notebook isn't synchronized anymore
         * and won't be re-used when the same resource is opened again.
         */
        readonly isClosed: boolean;
        /**
         * The {@link NotebookDocumentMetadata metadata} for this notebook.
         */
        readonly metadata: NotebookDocumentMetadata;
        /**
         * The number of cells in the notebook.
         */
        readonly cellCount: number;
        /**
         * Return the cell at the specified index. The index will be adjusted to the notebook.
         *
         * @param index - The index of the cell to retrieve.
         * @return A {@link NotebookCell cell}.
         */
        cellAt(index: number): NotebookCell;
        /**
         * Get the cells of this notebook. A subset can be retrieved by providing
         * a range. The range will be adjuset to the notebook.
         *
         * @param range A notebook range.
         * @returns The cells contained by the range or all cells.
         */
        getCells(range?: NotebookRange): NotebookCell[];
        /**
         * Save the document. The saving will be handled by the corresponding content provider
         *
         * @return A promise that will resolve to true when the document
         * has been saved. If the file was not dirty or the save failed,
         * will return false.
         */
        save(): Thenable<boolean>;
    }
    class NotebookCellMetadata {
        /**
         * Whether a code cell's editor is collapsed
         */
        readonly inputCollapsed?: boolean;
        /**
         * Whether a code cell's outputs are collapsed
         */
        readonly outputCollapsed?: boolean;
        /**
         * Additional attributes of a cell metadata.
         */
        readonly [key: string]: any;
        /**
         * Create a new notebook cell metadata.
         *
         * @param inputCollapsed Whether a code cell's editor is collapsed
         * @param outputCollapsed Whether a code cell's outputs are collapsed
         */
        constructor(inputCollapsed?: boolean, outputCollapsed?: boolean);
        /**
         * Derived a new cell metadata from this metadata.
         *
         * @param change An object that describes a change to this NotebookCellMetadata.
         * @return A new NotebookCellMetadata that reflects the given change. Will return `this` NotebookCellMetadata if the change
         *  is not changing anything.
         */
        with(change: {
            inputCollapsed?: boolean | null;
            outputCollapsed?: boolean | null;
            [key: string]: any;
        }): NotebookCellMetadata;
    }
    interface NotebookCellExecutionSummary {
        readonly executionOrder?: number;
        readonly success?: boolean;
        readonly startTime?: number;
        readonly endTime?: number;
    }
    class NotebookDocumentMetadata {
        /**
         * Additional attributes of the document metadata.
         */
        readonly [key: string]: any;
        /**
         * Create a new notebook document metadata
         */
        constructor();
        /**
         * Derived a new document metadata from this metadata.
         *
         * @param change An object that describes a change to this NotebookDocumentMetadata.
         * @return A new NotebookDocumentMetadata that reflects the given change. Will return `this` NotebookDocumentMetadata if the change
         *  is not changing anything.
         */
        with(change: {
            [key: string]: any;
        }): NotebookDocumentMetadata;
    }
    /**
     * A notebook range represents on ordered pair of two cell indicies.
     * It is guaranteed that start is less than or equal to end.
     */
    class NotebookRange {
        /**
         * The zero-based start index of this range.
         */
        readonly start: number;
        /**
         * The exclusive end index of this range (zero-based).
         */
        readonly end: number;
        /**
         * `true` if `start` and `end` are equal.
         */
        readonly isEmpty: boolean;
        /**
         * Create a new notebook range. If `start` is not
         * before or equal to `end`, the values will be swapped.
         *
         * @param start start index
         * @param end end index.
         */
        constructor(start: number, end: number);
        /**
         * Derive a new range for this range.
         *
         * @param change An object that describes a change to this range.
         * @return A range that reflects the given change. Will return `this` range if the change
         * is not changing anything.
         */
        with(change: {
            start?: number;
            end?: number;
        }): NotebookRange;
    }
    class NotebookCellOutputItem {
        mime: string;
        value: unknown;
        metadata?: Record<string, any>;
        constructor(mime: string, value: unknown, metadata?: Record<string, any>);
    }
    class NotebookCellOutput {
        id: string;
        outputs: NotebookCellOutputItem[];
        metadata?: Record<string, any>;
        constructor(outputs: NotebookCellOutputItem[], metadata?: Record<string, any>);
        constructor(outputs: NotebookCellOutputItem[], id: string, metadata?: Record<string, any>);
    }
    class NotebookCellData {
        kind: NotebookCellKind;
        source: string;
        language: string;
        outputs?: NotebookCellOutput[];
        metadata?: NotebookCellMetadata;
        latestExecutionSummary?: NotebookCellExecutionSummary;
        constructor(kind: NotebookCellKind, source: string, language: string, outputs?: NotebookCellOutput[], metadata?: NotebookCellMetadata, latestExecutionSummary?: NotebookCellExecutionSummary);
    }
    class NotebookData {
        cells: NotebookCellData[];
        metadata: NotebookDocumentMetadata;
        constructor(cells: NotebookCellData[], metadata?: NotebookDocumentMetadata);
    }
    /**
     * The notebook serializer enables the editor to open notebook files.
     *
     * At its core the editor only knows a {@link NotebookData notebook data structure} but not
     * how that data structure is written to a file, nor how it is read from a file. The
     * notebook serializer bridges this gap by deserializing bytes into notebook data and
     * vice versa.
     */
    interface NotebookSerializer {
        /**
         * Deserialize contents of a notebook file into the notebook data structure.
         *
         * @param content Contents of a notebook file.
         * @param token A cancellation token.
         * @return Notebook data or a thenable that resolves to such.
         */
        deserializeNotebook(content: Uint8Array, token: CancellationToken): NotebookData | Thenable<NotebookData>;
        /**
         * Serialize notebook data into file contents.
         *
         * @param data A notebook data structure.
         * @param token A cancellation token.
         * @returns An array of bytes or a thenable that resolves to such.
         */
        serializeNotebook(data: NotebookData, token: CancellationToken): Uint8Array | Thenable<Uint8Array>;
    }
    interface NotebookDocumentContentOptions {
        /**
         * Controls if outputs change will trigger notebook document content change and if it will be used in the diff editor
         * Default to false. If the content provider doesn't persisit the outputs in the file document, this should be set to true.
         */
        transientOutputs?: boolean;
        /**
         * Controls if a cell metadata property change will trigger notebook document content change and if it will be used in the diff editor
         * Default to false. If the content provider doesn't persisit a metadata property in the file document, it should be set to true.
         */
        transientCellMetadata?: {
            [K in keyof NotebookCellMetadata]?: boolean;
        };
        /**
        * Controls if a document metadata property change will trigger notebook document content change and if it will be used in the diff editor
        * Default to false. If the content provider doesn't persisit a metadata property in the file document, it should be set to true.
        */
        transientDocumentMetadata?: {
            [K in keyof NotebookDocumentMetadata]?: boolean;
        };
    }
    interface NotebookExecuteHandler {
        /**
         * @param cells The notebook cells to execute.
         * @param notebook The notebook for which the execute handler is being called.
         * @param controller The controller that the handler is attached to
         */
        (this: NotebookController, cells: NotebookCell[], notebook: NotebookDocument, controller: NotebookController): void | Thenable<void>;
    }
    interface NotebookInterruptHandler {
        /**
         * @param notebook The notebook for which the interrupt handler is being called.
         */
        (this: NotebookController, notebook: NotebookDocument): void | Thenable<void>;
    }
    enum NotebookControllerAffinity {
        Default = 1,
        Preferred = 2
    }
    class NotebookKernelPreload {
        /**
         * APIs that the preload provides to the renderer. These are matched
         * against the `dependencies` and `optionalDependencies` arrays in the
         * notebook renderer contribution point.
         */
        readonly provides: string[];
        /**
         * URI for the file to preload
         */
        readonly uri: Uri;
        /**
         * @param uri URI for the file to preload
         * @param provides Value for the `provides` property
         */
        constructor(uri: Uri, provides?: string | string[]);
    }
    interface NotebookCellExecuteStartContext {
        /**
         * The time that execution began, in milliseconds in the Unix epoch. Used to drive the clock
         * that shows for how long a cell has been running. If not given, the clock won't be shown.
         */
        startTime?: number;
    }
    interface NotebookCellExecuteEndContext {
        /**
         * If true, a green check is shown on the cell status bar.
         * If false, a red X is shown.
         */
        success?: boolean;
        /**
         * The time that execution finished, in milliseconds in the Unix epoch.
         */
        endTime?: number;
    }
    /**
     * A NotebookCellExecutionTask is how the kernel modifies a notebook cell as it is executing. When
     * {@link notebook.createNotebookCellExecutionTask `createNotebookCellExecutionTask`} is called, the cell
     * enters the Pending state. When `start()` is called on the execution task, it enters the Executing state. When
     * `end()` is called, it enters the Idle state. While in the Executing state, cell outputs can be
     * modified with the methods on the run task.
     *
     * All outputs methods operate on this NotebookCellExecutionTask's cell by default. They optionally take
     * a cellIndex parameter that allows them to modify the outputs of other cells. `appendOutputItems` and
     * `replaceOutputItems` operate on the output with the given ID, which can be an output on any cell. They
     * all resolve once the output edit has been applied.
     */
    interface NotebookCellExecutionTask {
        readonly document: NotebookDocument;
        readonly cell: NotebookCell;
        readonly token: CancellationToken;
        start(context?: NotebookCellExecuteStartContext): void;
        executionOrder: number | undefined;
        end(result?: NotebookCellExecuteEndContext): void;
        clearOutput(cellIndex?: number): Thenable<void>;
        appendOutput(out: NotebookCellOutput | NotebookCellOutput[], cellIndex?: number): Thenable<void>;
        replaceOutput(out: NotebookCellOutput | NotebookCellOutput[], cellIndex?: number): Thenable<void>;
        appendOutputItems(items: NotebookCellOutputItem | NotebookCellOutputItem[], outputId: string): Thenable<void>;
        replaceOutputItems(items: NotebookCellOutputItem | NotebookCellOutputItem[], outputId: string): Thenable<void>;
    }
    interface NotebookController {
        /**
         * The identifier of this notebook controller.
         */
        readonly id: string;
        /**
         * The notebook view type this controller is for.
         */
        readonly viewType: string;
        /**
         * An array of language identifiers that are supported by this
         * controller. Any language identifier from {@link languages.getLanguages `getLanguages`}
         * is possible. When falsy all languages are supported.
         *
         * Samples:
         * ```js
         * // support JavaScript and TypeScript
         * myController.supportedLanguages = ['javascript', 'typescript']
         *
         * // support all languages
         * myController.supportedLanguages = undefined; // falsy
         * myController.supportedLanguages = []; // falsy
         * ```
         */
        supportedLanguages?: string[];
        /**
         * The human-readable label of this notebook controller.
         */
        label: string;
        /**
         * The human-readable description which is rendered less prominent.
         */
        description?: string;
        /**
         * The human-readable detail which is rendered less prominent.
         */
        detail?: string;
        /**
         * Whether this controller supports execution order so that the
         * editor can render placeholders for them.
         */
        hasExecutionOrder?: boolean;
        /**
         * The execute handler is invoked when the run gestures in the UI are selected, e.g Run Cell, Run All,
         * Run Selection etc.
         */
        executeHandler: NotebookExecuteHandler;
        /**
         * The interrupt handler is invoked the interrupt all execution. This is contrary to cancellation (available via
         * [`NotebookCellExecutionTask#token`](NotebookCellExecutionTask#token)) and should only be used when
         * execution-level cancellation is supported
         */
        interruptHandler?: NotebookInterruptHandler;
        /**
         * Dispose and free associated resources.
         */
        dispose(): void;
        /**
         * A kernel can apply to one or many notebook documents but a notebook has only one active
         * kernel. This event fires whenever a notebook has been associated to a kernel or when
         * that association has been removed.
         */
        readonly onDidChangeNotebookAssociation: Event<{
            notebook: NotebookDocument;
            selected: boolean;
        }>;
        /**
         * A controller can set affinities for specific notebook documents. This allows a controller
         * to be more important for some notebooks.
         *
         * @param notebook The notebook for which a priority is set.
         * @param affinity A controller affinity
         */
        updateNotebookAffinity(notebook: NotebookDocument, affinity: NotebookControllerAffinity): void;
        /**
         * Create a cell execution task.
         *
         * This should be used in response to the {@link NotebookController.executeHandler execution handler}
         * being calleed or when cell execution has been started else, e.g when a cell was already
         * executing or when cell execution was triggered from another source.
         *
         * @param cell The notebook cell for which to create the execution.
         * @returns A notebook cell execution.
         */
        createNotebookCellExecutionTask(cell: NotebookCell): NotebookCellExecutionTask;
        readonly preloads: NotebookKernelPreload[];
        /**
         * An event that fires when a renderer (see `preloads`) has send a message to the controller.
         */
        readonly onDidReceiveMessage: Event<{
            editor: NotebookEditor;
            message: any;
        }>;
        /**
         * Send a message to the renderer of notebook editors.
         *
         * Note that only editors showing documents that are bound to this controller
         * are receiving the message.
         *
         * @param message The message to send.
         * @param editor A specific editor to send the message to. When `undefined` all applicable editors are receiving the message.
         * @returns A promise that resolves to a boolean indicating if the message has been send or not.
         */
        postMessage(message: any, editor?: NotebookEditor): Thenable<boolean>;
        asWebviewUri(localResource: Uri): Uri;
    }
    enum NotebookCellExecutionState {
        Idle = 1,
        Pending = 2,
        Executing = 3
    }
    interface NotebookCellExecutionStateChangeEvent {
        /**
         * The {@link NotebookDocument notebook document} for which the cell execution state has changed.
         */
        readonly document: NotebookDocument;
        readonly cell: NotebookCell;
        readonly executionState: NotebookCellExecutionState;
    }
    /**
     * Represents the alignment of status bar items.
     */
    enum NotebookCellStatusBarAlignment {
        /**
         * Aligned to the left side.
         */
        Left = 1,
        /**
         * Aligned to the right side.
         */
        Right = 2
    }
    class NotebookCellStatusBarItem {
        text: string;
        alignment: NotebookCellStatusBarAlignment;
        command?: string | Command;
        tooltip?: string;
        priority?: number;
        accessibilityInformation?: AccessibilityInformation;
        constructor(text: string, alignment: NotebookCellStatusBarAlignment, command?: string | Command, tooltip?: string, priority?: number, accessibilityInformation?: AccessibilityInformation);
    }
    interface NotebookCellStatusBarItemProvider {
        /**
         * Implement and fire this event to signal that statusbar items have changed. The provide method will be called again.
         */
        onDidChangeCellStatusBarItems?: Event<void>;
        /**
         * The provider will be called when the cell scrolls into view, when its content, outputs, language, or metadata change, and when it changes execution state.
         */
        provideCellStatusBarItems(cell: NotebookCell, token: CancellationToken): ProviderResult<NotebookCellStatusBarItem[]>;
    }
    namespace notebook {
        /**
         * Register a {@link NotebookSerializer notebook serializer}.
         *
         * @param notebookType A notebook.
         * @param serializer A notebook serialzier.
         * @param options Optional context options that define what parts of a notebook should be persisted
         * @return A {@link Disposable} that unregisters this serializer when being disposed.
         */
        function registerNotebookSerializer(notebookType: string, serializer: NotebookSerializer, options?: NotebookDocumentContentOptions): Disposable;
        /**
         * Creates a new notebook controller.
         *
         * @param id Identifier of the controller. Must be unique per extension.
         * @param viewType A notebook view type for which this controller is for.
         * @param label The label of the controller
         * @param handler
         * @param preloads
         */
        function createNotebookController(id: string, viewType: string, label: string, handler?: NotebookExecuteHandler, preloads?: NotebookKernelPreload[]): NotebookController;
        const onDidChangeCellExecutionState: Event<NotebookCellExecutionStateChangeEvent>;
        function registerNotebookCellStatusBarItemProvider(selector: NotebookSelector, provider: NotebookCellStatusBarItemProvider): Disposable;
    }
    enum NotebookEditorRevealType {
        /**
         * The range will be revealed with as little scrolling as possible.
         */
        Default = 0,
        /**
         * The range will always be revealed in the center of the viewport.
         */
        InCenter = 1,
        /**
         * If the range is outside the viewport, it will be revealed in the center of the viewport.
         * Otherwise, it will be revealed with as little scrolling as possible.
         */
        InCenterIfOutsideViewport = 2,
        /**
         * The range will always be revealed at the top of the viewport.
         */
        AtTop = 3
    }
    interface NotebookEditor {
        /**
         * The document associated with this notebook editor.
         */
        readonly document: NotebookDocument;
        /**
         * The selections on this notebook editor.
         *
         * The primary selection (or focused range) is `selections[0]`. When the document has no cells, the primary selection is empty `{ start: 0, end: 0 }`;
         */
        readonly selections: NotebookRange[];
        /**
         * The current visible ranges in the editor (vertically).
         */
        readonly visibleRanges: NotebookRange[];
        /**
         * Scroll as indicated by `revealType` in order to reveal the given range.
         *
         * @param range A range.
         * @param revealType The scrolling strategy for revealing `range`.
         */
        revealRange(range: NotebookRange, revealType?: NotebookEditorRevealType): void;
        /**
         * The column in which this editor shows.
         */
        readonly viewColumn?: ViewColumn;
    }
    interface NotebookDocumentMetadataChangeEvent {
        /**
         * The {@link NotebookDocument notebook document} for which the document metadata have changed.
         */
        readonly document: NotebookDocument;
    }
    interface NotebookCellsChangeData {
        readonly start: number;
        readonly deletedCount: number;
        readonly deletedItems: NotebookCell[];
        readonly items: NotebookCell[];
    }
    interface NotebookCellsChangeEvent {
        /**
         * The {@link NotebookDocument notebook document} for which the cells have changed.
         */
        readonly document: NotebookDocument;
        readonly changes: ReadonlyArray<NotebookCellsChangeData>;
    }
    interface NotebookCellOutputsChangeEvent {
        /**
         * The {@link NotebookDocument notebook document} for which the cell outputs have changed.
         */
        readonly document: NotebookDocument;
        readonly cells: NotebookCell[];
    }
    interface NotebookCellMetadataChangeEvent {
        /**
         * The {@link NotebookDocument notebook document} for which the cell metadata have changed.
         */
        readonly document: NotebookDocument;
        readonly cell: NotebookCell;
    }
    interface NotebookEditorSelectionChangeEvent {
        /**
         * The {@link NotebookEditor notebook editor} for which the selections have changed.
         */
        readonly notebookEditor: NotebookEditor;
        readonly selections: ReadonlyArray<NotebookRange>;
    }
    interface NotebookEditorVisibleRangesChangeEvent {
        /**
         * The {@link NotebookEditor notebook editor} for which the visible ranges have changed.
         */
        readonly notebookEditor: NotebookEditor;
        readonly visibleRanges: ReadonlyArray<NotebookRange>;
    }
    interface NotebookDocumentShowOptions {
        viewColumn?: ViewColumn;
        preserveFocus?: boolean;
        preview?: boolean;
        selections?: NotebookRange[];
    }
    namespace notebook {
        function openNotebookDocument(uri: Uri): Thenable<NotebookDocument>;
        const onDidOpenNotebookDocument: Event<NotebookDocument>;
        const onDidCloseNotebookDocument: Event<NotebookDocument>;
        const onDidSaveNotebookDocument: Event<NotebookDocument>;
        /**
         * All currently known notebook documents.
         */
        const notebookDocuments: ReadonlyArray<NotebookDocument>;
        const onDidChangeNotebookDocumentMetadata: Event<NotebookDocumentMetadataChangeEvent>;
        const onDidChangeNotebookCells: Event<NotebookCellsChangeEvent>;
        const onDidChangeCellOutputs: Event<NotebookCellOutputsChangeEvent>;
        const onDidChangeCellMetadata: Event<NotebookCellMetadataChangeEvent>;
    }
    namespace window {
        const visibleNotebookEditors: NotebookEditor[];
        const onDidChangeVisibleNotebookEditors: Event<NotebookEditor[]>;
        const activeNotebookEditor: NotebookEditor | undefined;
        const onDidChangeActiveNotebookEditor: Event<NotebookEditor | undefined>;
        const onDidChangeNotebookEditorSelection: Event<NotebookEditorSelectionChangeEvent>;
        const onDidChangeNotebookEditorVisibleRanges: Event<NotebookEditorVisibleRangesChangeEvent>;
        function showNotebookDocument(uri: Uri, options?: NotebookDocumentShowOptions): Thenable<NotebookEditor>;
        function showNotebookDocument(document: NotebookDocument, options?: NotebookDocumentShowOptions): Thenable<NotebookEditor>;
    }
    interface WorkspaceEdit {
        replaceNotebookMetadata(uri: Uri, value: NotebookDocumentMetadata): void;
        replaceNotebookCells(uri: Uri, range: NotebookRange, cells: NotebookCellData[], metadata?: WorkspaceEditEntryMetadata): void;
        replaceNotebookCellMetadata(uri: Uri, index: number, cellMetadata: NotebookCellMetadata, metadata?: WorkspaceEditEntryMetadata): void;
    }
    interface NotebookEditorEdit {
        replaceMetadata(value: NotebookDocumentMetadata): void;
        replaceCells(start: number, end: number, cells: NotebookCellData[]): void;
        replaceCellMetadata(index: number, metadata: NotebookCellMetadata): void;
    }
    interface NotebookEditor {
        /**
         * Perform an edit on the notebook associated with this notebook editor.
         *
         * The given callback-function is invoked with an {@link NotebookEditorEdit edit-builder} which must
         * be used to make edits. Note that the edit-builder is only valid while the
         * callback executes.
         *
         * @param callback A function which can create edits using an {@link NotebookEditorEdit edit-builder}.
         * @return A promise that resolves with a value indicating if the edits could be applied.
         */
        edit(callback: (editBuilder: NotebookEditorEdit) => void): Thenable<boolean>;
    }
    interface NotebookFilter {
        readonly viewType?: string;
        readonly scheme?: string;
        readonly pattern?: GlobPattern;
    }
    type NotebookSelector = NotebookFilter | string | ReadonlyArray<NotebookFilter | string>;
    interface NotebookDocumentBackup {
        /**
         * Unique identifier for the backup.
         *
         * This id is passed back to your extension in `openNotebook` when opening a notebook editor from a backup.
         */
        readonly id: string;
        /**
         * Delete the current backup.
         *
         * This is called by VS Code when it is clear the current backup is no longer needed, such as when a new backup
         * is made or when the file is saved.
         */
        delete(): void;
    }
    interface NotebookDocumentBackupContext {
        readonly destination: Uri;
    }
    interface NotebookDocumentOpenContext {
        readonly backupId?: string;
        readonly untitledDocumentData?: Uint8Array;
    }
    interface NotebookContentProvider {
        readonly options?: NotebookDocumentContentOptions;
        readonly onDidChangeNotebookContentOptions?: Event<NotebookDocumentContentOptions>;
        /**
         * Content providers should always use {@link FileSystemProvider file system providers} to
         * resolve the raw content for `uri` as the resouce is not necessarily a file on disk.
         */
        openNotebook(uri: Uri, openContext: NotebookDocumentOpenContext, token: CancellationToken): NotebookData | Thenable<NotebookData>;
        saveNotebook(document: NotebookDocument, token: CancellationToken): Thenable<void>;
        saveNotebookAs(targetResource: Uri, document: NotebookDocument, token: CancellationToken): Thenable<void>;
        backupNotebook(document: NotebookDocument, context: NotebookDocumentBackupContext, token: CancellationToken): Thenable<NotebookDocumentBackup>;
    }
    /**
     * todo@API Not ready for production or development use yet.
     */
    interface NotebookRegistrationData {
        displayName: string;
        filenamePattern: (GlobPattern | {
            include: GlobPattern;
            exclude: GlobPattern;
        })[];
        exclusive?: boolean;
    }
    namespace notebook {
        function registerNotebookContentProvider(notebookType: string, provider: NotebookContentProvider, options?: NotebookDocumentContentOptions): Disposable;
        function registerNotebookContentProvider(notebookType: string, provider: NotebookContentProvider, options?: NotebookDocumentContentOptions, registrationData?: NotebookRegistrationData): Disposable;
        function registerNotebookSerializer(notebookType: string, serializer: NotebookSerializer, options?: NotebookDocumentContentOptions, registration?: NotebookRegistrationData): Disposable;
    }
    interface NotebookEditor {
        setDecorations(decorationType: NotebookEditorDecorationType, range: NotebookRange): void;
    }
    interface NotebookDecorationRenderOptions {
        backgroundColor?: string | ThemeColor;
        borderColor?: string | ThemeColor;
        top: ThemableDecorationAttachmentRenderOptions;
    }
    interface NotebookEditorDecorationType {
        readonly key: string;
        dispose(): void;
    }
    namespace notebook {
        function createNotebookEditorDecorationType(options: NotebookDecorationRenderOptions): NotebookEditorDecorationType;
    }
    namespace notebook {
        /**
         * Create a document that is the concatenation of all  notebook cells. By default all code-cells are included
         * but a selector can be provided to narrow to down the set of cells.
         *
         * @param notebook
         * @param selector
         */
        function createConcatTextDocument(notebook: NotebookDocument, selector?: DocumentSelector): NotebookConcatTextDocument;
    }
    interface NotebookConcatTextDocument {
        readonly uri: Uri;
        readonly isClosed: boolean;
        dispose(): void;
        readonly onDidChange: Event<void>;
        readonly version: number;
        getText(): string;
        getText(range: Range): string;
        offsetAt(position: Position): number;
        positionAt(offset: number): Position;
        validateRange(range: Range): Range;
        validatePosition(position: Position): Position;
        locationAt(positionOrRange: Position | Range): Location;
        positionAt(location: Location): Position;
        contains(uri: Uri): boolean;
    }
    interface CompletionItem {
        /**
         * Will be merged into CompletionItem#label
         */
        label2?: CompletionItemLabel;
    }
    interface CompletionItemLabel {
        /**
         * The function or variable. Rendered leftmost.
         */
        name: string;
        /**
         * The parameters without the return type. Render after `name`.
         */
        parameters?: string;
        /**
         * The fully qualified name, like package name or file path. Rendered after `signature`.
         */
        qualifier?: string;
        /**
         * The return-type of a function or type of a property/variable. Rendered rightmost.
         */
        type?: string;
    }
    class TimelineItem {
        /**
         * A timestamp (in milliseconds since 1 January 1970 00:00:00) for when the timeline item occurred.
         */
        timestamp: number;
        /**
         * A human-readable string describing the timeline item.
         */
        label: string;
        /**
         * Optional id for the timeline item. It must be unique across all the timeline items provided by this source.
         *
         * If not provided, an id is generated using the timeline item's timestamp.
         */
        id?: string;
        /**
         * The icon path or {@link ThemeIcon} for the timeline item.
         */
        iconPath?: Uri | {
            light: Uri;
            dark: Uri;
        } | ThemeIcon;
        /**
         * A human readable string describing less prominent details of the timeline item.
         */
        description?: string;
        /**
         * The tooltip text when you hover over the timeline item.
         */
        detail?: string;
        /**
         * The {@link Command} that should be executed when the timeline item is selected.
         */
        command?: Command;
        /**
         * Context value of the timeline item. This can be used to contribute specific actions to the item.
         * For example, a timeline item is given a context value as `commit`. When contributing actions to `timeline/item/context`
         * using `menus` extension point, you can specify context value for key `timelineItem` in `when` expression like `timelineItem == commit`.
         * ```
         *	"contributes": {
         *		"menus": {
         *			"timeline/item/context": [
         *				{
         *					"command": "extension.copyCommitId",
         *					"when": "timelineItem == commit"
         *				}
         *			]
         *		}
         *	}
         * ```
         * This will show the `extension.copyCommitId` action only for items where `contextValue` is `commit`.
         */
        contextValue?: string;
        /**
         * Accessibility information used when screen reader interacts with this timeline item.
         */
        accessibilityInformation?: AccessibilityInformation;
        /**
         * @param label A human-readable string describing the timeline item
         * @param timestamp A timestamp (in milliseconds since 1 January 1970 00:00:00) for when the timeline item occurred
         */
        constructor(label: string, timestamp: number);
    }
    interface TimelineChangeEvent {
        /**
         * The {@link Uri} of the resource for which the timeline changed.
         */
        uri: Uri;
        /**
         * A flag which indicates whether the entire timeline should be reset.
         */
        reset?: boolean;
    }
    interface Timeline {
        readonly paging?: {
            /**
             * A provider-defined cursor specifying the starting point of timeline items which are after the ones returned.
             * Use `undefined` to signal that there are no more items to be returned.
             */
            readonly cursor: string | undefined;
        };
        /**
         * An array of {@link TimelineItem timeline items}.
         */
        readonly items: readonly TimelineItem[];
    }
    interface TimelineOptions {
        /**
         * A provider-defined cursor specifying the starting point of the timeline items that should be returned.
         */
        cursor?: string;
        /**
         * An optional maximum number timeline items or the all timeline items newer (inclusive) than the timestamp or id that should be returned.
         * If `undefined` all timeline items should be returned.
         */
        limit?: number | {
            timestamp: number;
            id?: string;
        };
    }
    interface TimelineProvider {
        /**
         * An optional event to signal that the timeline for a source has changed.
         * To signal that the timeline for all resources (uris) has changed, do not pass any argument or pass `undefined`.
         */
        onDidChange?: Event<TimelineChangeEvent | undefined>;
        /**
         * An identifier of the source of the timeline items. This can be used to filter sources.
         */
        readonly id: string;
        /**
         * A human-readable string describing the source of the timeline items. This can be used as the display label when filtering sources.
         */
        readonly label: string;
        /**
         * Provide {@link TimelineItem timeline items} for a {@link Uri}.
         *
         * @param uri The {@link Uri} of the file to provide the timeline for.
         * @param options A set of options to determine how results should be returned.
         * @param token A cancellation token.
         * @return The {@link TimelineResult timeline result} or a thenable that resolves to such. The lack of a result
         * can be signaled by returning `undefined`, `null`, or an empty array.
         */
        provideTimeline(uri: Uri, options: TimelineOptions, token: CancellationToken): ProviderResult<Timeline>;
    }
    namespace workspace {
        /**
         * Register a timeline provider.
         *
         * Multiple providers can be registered. In that case, providers are asked in
         * parallel and the results are merged. A failing provider (rejected promise or exception) will
         * not cause a failure of the whole operation.
         *
         * @param scheme A scheme or schemes that defines which documents this provider is applicable to. Can be `*` to target all documents.
         * @param provider A timeline provider.
         * @return A {@link Disposable} that unregisters this provider when being disposed.
        */
        function registerTimelineProvider(scheme: string | string[], provider: TimelineProvider): Disposable;
    }
    enum StandardTokenType {
        Other = 0,
        Comment = 1,
        String = 2,
        RegEx = 4
    }
    interface TokenInformation {
        type: StandardTokenType;
        range: Range;
    }
    namespace languages {
        function getTokenInformationAtPosition(document: TextDocument, position: Position): Thenable<TokenInformation>;
    }
    namespace languages {
        /**
         * Register a inlay hints provider.
         *
         * Multiple providers can be registered for a language. In that case providers are asked in
         * parallel and the results are merged. A failing provider (rejected promise or exception) will
         * not cause a failure of the whole operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider An inlay hints provider.
         * @return A {@link Disposable} that unregisters this provider when being disposed.
         */
        function registerInlayHintsProvider(selector: DocumentSelector, provider: InlayHintsProvider): Disposable;
    }
    enum InlayHintKind {
        Other = 0,
        Type = 1,
        Parameter = 2
    }
    /**
     * Inlay hint information.
     */
    class InlayHint {
        /**
         * The text of the hint.
         */
        text: string;
        /**
         * The position of this hint.
         */
        position: Position;
        /**
         * The kind of this hint.
         */
        kind?: InlayHintKind;
        /**
         * Whitespace before the hint.
         */
        whitespaceBefore?: boolean;
        /**
         * Whitespace after the hint.
         */
        whitespaceAfter?: boolean;
        constructor(text: string, position: Position, kind?: InlayHintKind);
    }
    /**
     * The inlay hints provider interface defines the contract between extensions and
     * the inlay hints feature.
     */
    interface InlayHintsProvider {
        /**
         * An optional event to signal that inlay hints have changed.
         * @see {@link EventEmitter}
         */
        onDidChangeInlayHints?: Event<void>;
        /**
         *
         * @param model The document in which the command was invoked.
         * @param range The range for which inlay hints should be computed.
         * @param token A cancellation token.
         * @return A list of inlay hints or a thenable that resolves to such.
         */
        provideInlayHints(model: TextDocument, range: Range, token: CancellationToken): ProviderResult<InlayHint[]>;
    }
    enum ExtensionRuntime {
        /**
         * The extension is running in a NodeJS extension host. Runtime access to NodeJS APIs is available.
         */
        Node = 1,
        /**
         * The extension is running in a Webworker extension host. Runtime access is limited to Webworker APIs.
         */
        Webworker = 2
    }
    interface ExtensionContext {
        readonly extensionRuntime: ExtensionRuntime;
    }
    interface TextDocument {
        /**
         * The {@link NotebookDocument notebook} that contains this document as a notebook cell or `undefined` when
         * the document is not contained by a notebook (this should be the more frequent case).
         */
        notebook: NotebookDocument | undefined;
    }
    namespace test {
        /**
         * Registers a controller that can discover and
         * run tests in workspaces and documents.
         */
        function registerTestController<T>(testController: TestController<T>): Disposable;
        /**
         * Requests that tests be run by their controller.
         * @param run Run options to use
         * @param token Cancellation token for the test run
         */
        function runTests<T>(run: TestRunRequest<T>, token?: CancellationToken): Thenable<void>;
        /**
         * Returns an observer that retrieves tests in the given workspace folder.
         * @stability experimental
         */
        function createWorkspaceTestObserver(workspaceFolder: WorkspaceFolder): TestObserver;
        /**
         * Returns an observer that retrieves tests in the given text document.
         * @stability experimental
         */
        function createDocumentTestObserver(document: TextDocument): TestObserver;
        /**
         * Creates a {@link TestRun<T>}. This should be called by the
         * {@link TestRunner} when a request is made to execute tests, and may also
         * be called if a test run is detected externally. Once created, tests
         * that are included in the results will be moved into the
         * {@link TestResultState.Pending} state.
         *
         * @param request Test run request. Only tests inside the `include` may be
         * modified, and tests in its `exclude` are ignored.
         * @param name The human-readable name of the run. This can be used to
         * disambiguate multiple sets of results in a test run. It is useful if
         * tests are run across multiple platforms, for example.
         * @param persist Whether the results created by the run should be
         * persisted in VS Code. This may be false if the results are coming from
         * a file already saved externally, such as a coverage information file.
         */
        function createTestRun<T>(request: TestRunRequest<T>, name?: string, persist?: boolean): TestRun<T>;
        /**
         * Creates a new managed {@link TestItem} instance.
         * @param options Initial/required options for the item
         * @param data Custom data to be stored in {@link TestItem.data}
         */
        function createTestItem<T, TChildren = T>(options: TestItemOptions, data: T): TestItem<T, TChildren>;
        /**
         * Creates a new managed {@link TestItem} instance.
         * @param options Initial/required options for the item
         */
        function createTestItem<T = void, TChildren = any>(options: TestItemOptions): TestItem<T, TChildren>;
        /**
         * List of test results stored by VS Code, sorted in descnding
         * order by their `completedAt` time.
         * @stability experimental
         */
        const testResults: ReadonlyArray<TestRunResult>;
        /**
         * Event that fires when the {@link testResults} array is updated.
         * @stability experimental
         */
        const onDidChangeTestResults: Event<void>;
    }
    /**
     * @stability experimental
     */
    interface TestObserver {
        /**
         * List of tests returned by test provider for files in the workspace.
         */
        readonly tests: ReadonlyArray<TestItem<never>>;
        /**
         * An event that fires when an existing test in the collection changes, or
         * null if a top-level test was added or removed. When fired, the consumer
         * should check the test item and all its children for changes.
         */
        readonly onDidChangeTest: Event<TestsChangeEvent>;
        /**
         * An event that fires when all test providers have signalled that the tests
         * the observer references have been discovered. Providers may continue to
         * watch for changes and cause {@link onDidChangeTest} to fire as files
         * change, until the observer is disposed.
         *
         * @todo as below
         */
        readonly onDidDiscoverInitialTests: Event<void>;
        /**
         * Dispose of the observer, allowing VS Code to eventually tell test
         * providers that they no longer need to update tests.
         */
        dispose(): void;
    }
    /**
     * @stability experimental
     */
    interface TestsChangeEvent {
        /**
         * List of all tests that are newly added.
         */
        readonly added: ReadonlyArray<TestItem<never>>;
        /**
         * List of existing tests that have updated.
         */
        readonly updated: ReadonlyArray<TestItem<never>>;
        /**
         * List of existing tests that have been removed.
         */
        readonly removed: ReadonlyArray<TestItem<never>>;
    }
    /**
     * Interface to discover and execute tests.
     */
    interface TestController<T> {
        /**
         * Requests that tests be provided for the given workspace. This will
         * be called when tests need to be enumerated for the workspace, such as
         * when the user opens the test explorer.
         *
         * It's guaranteed that this method will not be called again while
         * there is a previous uncancelled call for the given workspace folder.
         *
         * @param workspace The workspace in which to observe tests
         * @param cancellationToken Token that signals the used asked to abort the test run.
         * @returns the root test item for the workspace
         */
        createWorkspaceTestRoot(workspace: WorkspaceFolder, token: CancellationToken): ProviderResult<TestItem<T>>;
        /**
         * Requests that tests be provided for the given document. This will be
         * called when tests need to be enumerated for a single open file, for
         * instance by code lens UI.
         *
         * It's suggested that the provider listen to change events for the text
         * document to provide information for tests that might not yet be
         * saved.
         *
         * If the test system is not able to provide or estimate for tests on a
         * per-file basis, this method may not be implemented. In that case, the
         * editor will request and use the information from the workspace tree.
         *
         * @param document The document in which to observe tests
         * @param cancellationToken Token that signals the used asked to abort the test run.
         * @returns the root test item for the document
         */
        createDocumentTestRoot?(document: TextDocument, token: CancellationToken): ProviderResult<TestItem<T>>;
        /**
         * Starts a test run. When called, the controller should call
         * {@link vscode.test.createTestRun}. All tasks associated with the
         * run should be created before the function returns or the reutrned
         * promise is resolved.
         *
         * @param options Options for this test run
         * @param cancellationToken Token that signals the used asked to abort the test run.
         */
        runTests(options: TestRunRequest<T>, token: CancellationToken): Thenable<void> | void;
    }
    /**
     * Options given to {@link test.runTests}.
     */
    interface TestRunRequest<T> {
        /**
         * Array of specific tests to run. The controllers should run all of the
         * given tests and all children of the given tests, excluding any tests
         * that appear in {@link TestRunRequest.exclude}.
         */
        tests: TestItem<T>[];
        /**
         * An array of tests the user has marked as excluded in VS Code. May be
         * omitted if no exclusions were requested. Test controllers should not run
         * excluded tests or any children of excluded tests.
         */
        exclude?: TestItem<T>[];
        /**
         * Whether tests in this run should be debugged.
         */
        debug: boolean;
    }
    /**
     * Options given to {@link TestController.runTests}
     */
    interface TestRun<T = void> {
        /**
         * The human-readable name of the run. This can be used to
         * disambiguate multiple sets of results in a test run. It is useful if
         * tests are run across multiple platforms, for example.
         */
        readonly name?: string;
        /**
         * Updates the state of the test in the run. Calling with method with nodes
         * outside the {@link TestRunRequest.tests} or in the
         * {@link TestRunRequest.exclude} array will no-op.
         *
         * @param test The test to update
         * @param state The state to assign to the test
         * @param duration Optionally sets how long the test took to run
         */
        setState(test: TestItem<T>, state: TestResultState, duration?: number): void;
        /**
         * Appends a message, such as an assertion error, to the test item.
         *
         * Calling with method with nodes outside the {@link TestRunRequest.tests}
         * or in the {@link TestRunRequest.exclude} array will no-op.
         *
         * @param test The test to update
         * @param state The state to assign to the test
         *
         */
        appendMessage(test: TestItem<T>, message: TestMessage): void;
        /**
         * Appends raw output from the test runner. On the user's request, the
         * output will be displayed in a terminal. ANSI escape sequences,
         * such as colors and text styles, are supported.
         *
         * @param output Output text to append
         * @param associateTo Optionally, associate the given segment of output
         */
        appendOutput(output: string): void;
        /**
         * Signals that the end of the test run. Any tests whose states have not
         * been updated will be moved into the {@link TestResultState.Unset} state.
         */
        end(): void;
    }
    /**
     * Indicates the the activity state of the {@link TestItem}.
     */
    enum TestItemStatus {
        /**
         * All children of the test item, if any, have been discovered.
         */
        Resolved = 1,
        /**
         * The test item may have children who have not been discovered yet.
         */
        Pending = 0
    }
    /**
     * Options initially passed into `vscode.test.createTestItem`
     */
    interface TestItemOptions {
        /**
         * Unique identifier for the TestItem. This is used to correlate
         * test results and tests in the document with those in the workspace
         * (test explorer). This cannot change for the lifetime of the TestItem.
         */
        id: string;
        /**
         * URI this TestItem is associated with. May be a file or directory.
         */
        uri?: Uri;
        /**
         * Display name describing the test item.
         */
        label: string;
    }
    /**
     * A test item is an item shown in the "test explorer" view. It encompasses
     * both a suite and a test, since they have almost or identical capabilities.
     */
    interface TestItem<T, TChildren = any> {
        /**
         * Unique identifier for the TestItem. This is used to correlate
         * test results and tests in the document with those in the workspace
         * (test explorer). This must not change for the lifetime of the TestItem.
         */
        readonly id: string;
        /**
         * URI this TestItem is associated with. May be a file or directory.
         */
        readonly uri?: Uri;
        /**
         * A mapping of children by ID to the associated TestItem instances.
         */
        readonly children: ReadonlyMap<string, TestItem<TChildren>>;
        /**
         * The parent of this item, if any. Assigned automatically when calling
         * {@link TestItem.addChild}.
         */
        readonly parent?: TestItem<any>;
        /**
         * Indicates the state of the test item's children. The editor will show
         * TestItems in the `Pending` state and with a `resolveHandler` as being
         * expandable, and will call the `resolveHandler` to request items.
         *
         * A TestItem in the `Resolved` state is assumed to have discovered and be
         * watching for changes in its children if applicable. TestItems are in the
         * `Resolved` state when initially created; if the editor should call
         * the `resolveHandler` to discover children, set the state to `Pending`
         * after creating the item.
         */
        status: TestItemStatus;
        /**
         * Display name describing the test case.
         */
        label: string;
        /**
         * Optional description that appears next to the label.
         */
        description?: string;
        /**
         * Location of the test item in its `uri`. This is only meaningful if the
         * `uri` points to a file.
         */
        range?: Range;
        /**
         * May be set to an error associated with loading the test. Note that this
         * is not a test result and should only be used to represent errors in
         * discovery, such as syntax errors.
         */
        error?: string | MarkdownString;
        /**
         * Whether this test item can be run by providing it in the
         * {@link TestRunRequest.tests} array. Defaults to `true`.
         */
        runnable: boolean;
        /**
         * Whether this test item can be debugged by providing it in the
         * {@link TestRunRequest.tests} array. Defaults to `false`.
         */
        debuggable: boolean;
        /**
         * Custom extension data on the item. This data will never be serialized
         * or shared outside the extenion who created the item.
         */
        data: T;
        /**
         * Marks the test as outdated. This can happen as a result of file changes,
         * for example. In "auto run" mode, tests that are outdated will be
         * automatically rerun after a short delay. Invoking this on a
         * test with children will mark the entire subtree as outdated.
         *
         * Extensions should generally not override this method.
         */
        invalidate(): void;
        /**
         * A function provided by the extension that the editor may call to request
         * children of the item, if the {@link TestItem.status} is `Pending`.
         *
         * When called, the item should discover tests and call {@link TestItem.addChild}.
         * The items should set its {@link TestItem.status} to `Resolved` when
         * discovery is finished.
         *
         * The item should continue watching for changes to the children and
         * firing updates until the token is cancelled. The process of watching
         * the tests may involve creating a file watcher, for example. After the
         * token is cancelled and watching stops, the TestItem should set its
         * {@link TestItem.status} back to `Pending`.
         *
         * The editor will only call this method when it's interested in refreshing
         * the children of the item, and will not call it again while there's an
         * existing, uncancelled discovery for an item.
         *
         * @param token Cancellation for the request. Cancellation will be
         * requested if the test changes before the previous call completes.
         */
        resolveHandler?: (token: CancellationToken) => void;
        /**
         * Attaches a child, created from the {@link test.createTestItem} function,
         * to this item. A `TestItem` may be a child of at most one other item.
         */
        addChild(child: TestItem<TChildren>): void;
        /**
         * Removes the test and its children from the tree. Any tokens passed to
         * child `resolveHandler` methods will be cancelled.
         */
        dispose(): void;
    }
    /**
     * Possible states of tests in a test run.
     */
    enum TestResultState {
        Unset = 0,
        Queued = 1,
        Running = 2,
        Passed = 3,
        Failed = 4,
        Skipped = 5,
        Errored = 6
    }
    /**
     * Represents the severity of test messages.
     */
    enum TestMessageSeverity {
        Error = 0,
        Warning = 1,
        Information = 2,
        Hint = 3
    }
    /**
     * Message associated with the test state. Can be linked to a specific
     * source range -- useful for assertion failures, for example.
     */
    class TestMessage {
        /**
         * Human-readable message text to display.
         */
        message: string | MarkdownString;
        /**
         * Message severity. Defaults to "Error".
         */
        severity: TestMessageSeverity;
        /**
         * Expected test output. If given with `actualOutput`, a diff view will be shown.
         */
        expectedOutput?: string;
        /**
         * Actual test output. If given with `expectedOutput`, a diff view will be shown.
         */
        actualOutput?: string;
        /**
         * Associated file location.
         */
        location?: Location;
        /**
         * Creates a new TestMessage that will present as a diff in the editor.
         * @param message Message to display to the user.
         * @param expected Expected output.
         * @param actual Actual output.
         */
        static diff(message: string | MarkdownString, expected: string, actual: string): TestMessage;
        /**
         * Creates a new TestMessage instance.
         * @param message The message to show to the user.
         */
        constructor(message: string | MarkdownString);
    }
    /**
     * TestResults can be provided to VS Code in {@link test.publishTestResult},
     * or read from it in {@link test.testResults}.
     *
     * The results contain a 'snapshot' of the tests at the point when the test
     * run is complete. Therefore, information such as its {@link Range} may be
     * out of date. If the test still exists in the workspace, consumers can use
     * its `id` to correlate the result instance with the living test.
     *
     * @todo coverage and other info may eventually be provided here
     */
    interface TestRunResult {
        /**
         * Unix milliseconds timestamp at which the test run was completed.
         */
        completedAt: number;
        /**
         * Optional raw output from the test run.
         */
        output?: string;
        /**
         * List of test results. The items in this array are the items that
         * were passed in the {@link test.runTests} method.
         */
        results: ReadonlyArray<Readonly<TestResultSnapshot>>;
    }
    /**
     * A {@link TestItem}-like interface with an associated result, which appear
     * or can be provided in {@link TestResult} interfaces.
     */
    interface TestResultSnapshot {
        /**
         * Unique identifier that matches that of the associated TestItem.
         * This is used to correlate test results and tests in the document with
         * those in the workspace (test explorer).
         */
        readonly id: string;
        /**
         * URI this TestItem is associated with. May be a file or file.
         */
        readonly uri?: Uri;
        /**
         * Display name describing the test case.
         */
        readonly label: string;
        /**
         * Optional description that appears next to the label.
         */
        readonly description?: string;
        /**
         * Location of the test item in its `uri`. This is only meaningful if the
         * `uri` points to a file.
         */
        readonly range?: Range;
        /**
         * State of the test in each task. In the common case, a test will only
         * be executed in a single task and the length of this array will be 1.
         */
        readonly taskStates: ReadonlyArray<TestSnapshoptTaskState>;
        /**
         * Optional list of nested tests for this item.
         */
        readonly children: Readonly<TestResultSnapshot>[];
    }
    interface TestSnapshoptTaskState {
        /**
         * Current result of the test.
         */
        readonly state: TestResultState;
        /**
         * The number of milliseconds the test took to run. This is set once the
         * `state` is `Passed`, `Failed`, or `Errored`.
         */
        readonly duration?: number;
        /**
         * Associated test run message. Can, for example, contain assertion
         * failure information if the test fails.
         */
        readonly messages: ReadonlyArray<TestMessage>;
    }
    /**
     * Details if an `ExternalUriOpener` can open a uri.
     *
     * The priority is also used to rank multiple openers against each other and determine
     * if an opener should be selected automatically or if the user should be prompted to
     * select an opener.
     *
     * VS Code will try to use the best available opener, as sorted by `ExternalUriOpenerPriority`.
     * If there are multiple potential "best" openers for a URI, then the user will be prompted
     * to select an opener.
     */
    enum ExternalUriOpenerPriority {
        /**
         * The opener is disabled and will never be shown to users.
         *
         * Note that the opener can still be used if the user specifically
         * configures it in their settings.
         */
        None = 0,
        /**
         * The opener can open the uri but will not cause a prompt on its own
         * since VS Code always contributes a built-in `Default` opener.
         */
        Option = 1,
        /**
         * The opener can open the uri.
         *
         * VS Code's built-in opener has `Default` priority. This means that any additional `Default`
         * openers will cause the user to be prompted to select from a list of all potential openers.
         */
        Default = 2,
        /**
         * The opener can open the uri and should be automatically selected over any
         * default openers, include the built-in one from VS Code.
         *
         * A preferred opener will be automatically selected if no other preferred openers
         * are available. If multiple preferred openers are available, then the user
         * is shown a prompt with all potential openers (not just preferred openers).
         */
        Preferred = 3
    }
    /**
     * Handles opening uris to external resources, such as http(s) links.
     *
     * Extensions can implement an `ExternalUriOpener` to open `http` links to a webserver
     * inside of VS Code instead of having the link be opened by the web browser.
     *
     * Currently openers may only be registered for `http` and `https` uris.
     */
    interface ExternalUriOpener {
        /**
         * Check if the opener can open a uri.
         *
         * @param uri The uri being opened. This is the uri that the user clicked on. It has
         * not yet gone through port forwarding.
         * @param token Cancellation token indicating that the result is no longer needed.
         *
         * @return Priority indicating if the opener can open the external uri.
         */
        canOpenExternalUri(uri: Uri, token: CancellationToken): ExternalUriOpenerPriority | Thenable<ExternalUriOpenerPriority>;
        /**
         * Open a uri.
         *
         * This is invoked when:
         *
         * - The user clicks a link which does not have an assigned opener. In this case, first `canOpenExternalUri`
         *   is called and if the user selects this opener, then `openExternalUri` is called.
         * - The user sets the default opener for a link in their settings and then visits a link.
         *
         * @param resolvedUri The uri to open. This uri may have been transformed by port forwarding, so it
         * may not match the original uri passed to `canOpenExternalUri`. Use `ctx.originalUri` to check the
         * original uri.
         * @param ctx Additional information about the uri being opened.
         * @param token Cancellation token indicating that opening has been canceled.
         *
         * @return Thenable indicating that the opening has completed.
         */
        openExternalUri(resolvedUri: Uri, ctx: OpenExternalUriContext, token: CancellationToken): Thenable<void> | void;
    }
    /**
     * Additional information about the uri being opened.
     */
    interface OpenExternalUriContext {
        /**
         * The uri that triggered the open.
         *
         * This is the original uri that the user clicked on or that was passed to `openExternal.`
         * Due to port forwarding, this may not match the `resolvedUri` passed to `openExternalUri`.
         */
        readonly sourceUri: Uri;
    }
    /**
     * Additional metadata about a registered `ExternalUriOpener`.
     */
    interface ExternalUriOpenerMetadata {
        /**
         * List of uri schemes the opener is triggered for.
         *
         * Currently only `http` and `https` are supported.
         */
        readonly schemes: readonly string[];
        /**
         * Text displayed to the user that explains what the opener does.
         *
         * For example, 'Open in browser preview'
         */
        readonly label: string;
    }
    namespace window {
        /**
         * Register a new `ExternalUriOpener`.
         *
         * When a uri is about to be opened, an `onOpenExternalUri:SCHEME` activation event is fired.
         *
         * @param id Unique id of the opener, such as `myExtension.browserPreview`. This is used in settings
         *   and commands to identify the opener.
         * @param opener Opener to register.
         * @param metadata Additional information about the opener.
         *
        * @returns Disposable that unregisters the opener.
        */
        function registerExternalUriOpener(id: string, opener: ExternalUriOpener, metadata: ExternalUriOpenerMetadata): Disposable;
    }
    interface OpenExternalOptions {
        /**
         * Allows using openers contributed by extensions through  `registerExternalUriOpener`
         * when opening the resource.
         *
         * If `true`, VS Code will check if any contributed openers can handle the
         * uri, and fallback to the default opener behavior.
         *
         * If it is string, this specifies the id of the `ExternalUriOpener`
         * that should be used if it is available. Use `'default'` to force VS Code's
         * standard external opener to be used.
         */
        readonly allowContributedOpeners?: boolean | string;
    }
    namespace env {
        function openExternal(target: Uri, options?: OpenExternalOptions): Thenable<boolean>;
    }
    interface OpenEditorInfo {
        name: string;
        resource: Uri;
    }
    namespace window {
        const openEditors: ReadonlyArray<OpenEditorInfo>;
        const onDidChangeOpenEditors: Event<void>;
    }
    /**
     * The object describing the properties of the workspace trust request
     */
    interface WorkspaceTrustRequestOptions {
        /**
         * Custom message describing the user action that requires workspace
         * trust. If omitted, a generic message will be displayed in the workspace
         * trust request dialog.
         */
        readonly message?: string;
    }
    namespace workspace {
        /**
         * Prompt the user to chose whether to trust the current workspace
         * @param options Optional object describing the properties of the
         * workspace trust request.
         */
        function requestWorkspaceTrust(options?: WorkspaceTrustRequestOptions): Thenable<boolean | undefined>;
    }
    enum PortAutoForwardAction {
        Notify = 1,
        OpenBrowser = 2,
        OpenPreview = 3,
        Silent = 4,
        Ignore = 5
    }
    interface PortAttributes {
        port: number;
        autoForwardAction: PortAutoForwardAction;
    }
    interface PortAttributesProvider {
        /**
         * Provides attributes for the given port. For ports that your extension doesn't know about, simply
         * return undefined. For example, if `providePortAttributes` is called with ports 3000 but your
         * extension doesn't know anything about 3000 you should return undefined.
         */
        providePortAttributes(port: number, pid: number | undefined, commandLine: string | undefined, token: CancellationToken): ProviderResult<PortAttributes>;
    }
    namespace workspace {
        /**
         * If your extension listens on ports, consider registering a PortAttributesProvider to provide information
         * about the ports. For example, a debug extension may know about debug ports in it's debuggee. By providing
         * this information with a PortAttributesProvider the extension can tell VS Code that these ports should be
         * ignored, since they don't need to be user facing.
         *
         * @param portSelector If registerPortAttributesProvider is called after you start your process then you may already
         * know the range of ports or the pid of your process. All properties of a the portSelector must be true for your
         * provider to get called.
         * The `portRange` is start inclusive and end exclusive.
         * @param provider The PortAttributesProvider
         */
        function registerPortAttributesProvider(portSelector: {
            pid?: number;
            portRange?: [number, number];
            commandMatcher?: RegExp;
        }, provider: PortAttributesProvider): Disposable;
    }
    interface SourceControlInputBox {
        /**
         * Sets focus to the input.
         */
        focus(): void;
    }
}