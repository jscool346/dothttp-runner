import { MarkdownString } from "vscode";

export interface DothttpRunOptions {
    noCookie?: boolean,
    experimental?: boolean,
    env?: string[],
    propertyFile?: String,
    curl: boolean
    file: string,
    target?: string,
    properties?: { [prop: string]: string },
}



export enum DothttpTypes {
    NAME = "name",
    EXTRA_ARGS = "extra_args",
    URL = "url",
    BASIC_AUTH = "basic_auth",
    DIGEST_AUTH = "digest_auth",
    CERTIFICATE = "certificate",
    HEADER = "header",
    URL_PARAMS = "urlparams",
    PAYLOAD_DATA = "payload_data",
    PAYLOAD_ENCODED = "payload_urlencoded",
    PAYLOAD_FILE = "payload_file_input",
    PAYLOAD_JSON = "payload_json",
    PAYLOAD_MULTIPART = "payload_multipart",
    OUTPUT = "output",
    SCRIPT = "script",
    COMMENT = "comment"
}

type Immutable<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
}

export const DotHovers = {
    // TODO add documentation link
    "name": new MarkdownString(`Unique Identifier incase of multiple httpdef in single file

visit naming [docs](https://docs.dothttp.dev/docs/multidef#definenaming)

extend targets like below

\`@name('auth')\`

\`@name('getdata'): 'auth'\`

visit extend [extend](https://docs.dothttp.dev/docs/extend)

`
    ),
    "extra_args": new MarkdownString(`Extra request modifier, such allow insecure, clear session after request

\`@insecure\` : allows self signed certificates

\`@clear\` : clears session

visit [docs](https://docs.dothttp.dev/docs/flags)`),
    "url": new MarkdownString("Url of httpdef"),
    "basic_auth": new MarkdownString(`Configured with HttpDef Basic authentication mechanism

example:
\`basicauth("<username>", "<password>")\`

`),
    "digest_auth": new MarkdownString(`Configured with HttpDef Digest authentication mechanism

example:
\`digestauth("<username>", "<password>")\`
`),
    "certificate": new MarkdownString(`Configured to use Certificate while making requests

example: \`certificate(cert="<certificate path>",key= "<privatekey path>")\`

visit [docs](https://docs.dothttp.dev/docs/certificates)
`),
    "header": new MarkdownString("Header defined for httpdef"),
    "urlparams": new MarkdownString(`Urlparams of the request

example: 
\`\`\`
? key=value
? key2=value2
\`\`\`

visit [docs](https://docs.dothttp.dev/docs/request-basics#url-params)`),
    "payload_data": new MarkdownString(`Text Payload of the request (sets content-type to text/plain)

example:

\`data("this is payload")\`
visit [docs](https://docs.dothttp.dev/docs/request-basics#example-2-text-payload)`),
    "payload_urlencoded": new MarkdownString(`UrlEncoded payload (sets content-type to urlformencoded)

example:

\`urlencoded({"key": "value"})\`

visit [docs](https://docs.dothttp.dev/docs/request-basics#example-4-urlencode)
`),
    "payload_file_input": new MarkdownString(`FileInput for the payload (sets content-type according to file type)

example:

\`fileinput("<path to upload>")\`
    
visit [docs](https://docs.dothttp.dev/docs/request-basics#binary)
`),
    "payload_json": new MarkdownString(`JsonPayload for the requset (sets content-type to application/json)
example:

\`json({"key": "value"})\`

visit [docs](https://docs.dothttp.dev/docs/request-basics#example-3-json-payload)`),
    "payload_multipart": new MarkdownString(`Multipart payload

example:
\`\`\`
files(
    ("<key>", "<path to file or data>"),
    ("<key>", "<path to file or data>", "<optional content-type>")
)
\`\`\`
visit [docs](https://docs.dothttp.dev/docs/request-basics#multipart)`),
    "output": new MarkdownString("save Output in output filename"),
    "script": new MarkdownString(`Run Javascript script after execution of httpdef

visit [docs](https://docs.dothttp.dev/docs/scripts)`),
    "comment": new MarkdownString("Comment"),
};
