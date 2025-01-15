import {
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  ListObjectsV2CommandInput,
  S3Client,
  S3ClientConfig,
  GetObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3'

export class PfsClient {
  public readonly s3Client: S3Client
  public readonly pfsBucket: string
  public readonly folder: string = 'vci-do'

  constructor() {

    this.pfsBucket = `vci-pfs-devbox`

    const s3ClientConfig: S3ClientConfig = {
      region: 'us-west-2',
      endpoint: 'http://localhost:4566',
    }
    s3ClientConfig.forcePathStyle = true
    this.s3Client = new S3Client(s3ClientConfig)
  }

  public async listBucketContents(maxKeys = 0): Promise<ListObjectsV2CommandOutput | undefined> {
    const listCommandInput: ListObjectsV2CommandInput = {
      Bucket: this.pfsBucket,
      Prefix: `${this.folder}/`,
    }

    if (maxKeys > 0) listCommandInput.MaxKeys = maxKeys

    const command = new ListObjectsV2Command(listCommandInput)
    try {
      console.log(`Listing Bucket Content: "${this.pfsBucket}/${this.folder}/"`)
      const data = await this.s3Client.send(command)

      return data
    } catch (error) {
      console.log(`Cannot list contents of bucket "${this.pfsBucket}/${this.folder}/"`, error)
    }

    return undefined
  }

  public async getFileContent(key: string): Promise<string | undefined> {
    const params = {
      Bucket: this.pfsBucket,
      Key: key,
    }
    const command = new GetObjectCommand(params)
    const response = await this.s3Client.send(command)

    if (!response.Body) {
      console.log('S3 Body undefined')
    }

    return response.Body?.transformToString()
  }

  public async uploadString(key: string, content: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.pfsBucket,
        Key: `${this.folder}/${key}`,
        Body: content,
        ContentType: 'text/plain', // Specify the content type
      })

      const response = await this.s3Client.send(command)
      console.log('Upload successful', response)

      return response
    } catch (err) {
      console.error('Error uploading string to S3:', err)
      throw err
    }
  }
}
