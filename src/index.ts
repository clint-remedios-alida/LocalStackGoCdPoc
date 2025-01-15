import { PfsClient } from './clients/pfsClient'
 
export async function main(): Promise<void> {
    const pfsClient = new PfsClient()
    const currentDateString = new Date().toISOString()
    console.log("Uploading");
    await pfsClient.uploadString(`TestFile-${currentDateString}`, 'This is a test file.')
    console.log("Listing");
    var response = await pfsClient.listBucketContents();
    console.log("Printing");
    if (response)
        response.Contents?.forEach((item) => {
            console.log(item.Key); // Log the file name
        });
}



main()

