export async function uploadAssetsToIPFS(data: File) {
  const formData = new FormData()
  formData.append('file', data, 'img')
  try {
    const upload = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      body: formData
    })
    const { Hash }: { Hash: string } = await upload.json()

    return {
      item: `https://ipfs.infura.io/ipfs/${Hash}`,
      type: data.type
    }
  } catch (e) {
    console.log('IPFS Upload error: ', e)
  }
}
