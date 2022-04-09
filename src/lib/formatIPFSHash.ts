const formatIPFSHash = (hash: string) => {
  return `${hash.slice(0, 4)}…${hash.slice(hash.length - 4, hash.length)}`
}

export default formatIPFSHash
