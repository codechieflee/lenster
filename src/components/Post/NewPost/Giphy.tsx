import { Input } from '@components/UI/Input'
import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import { GiphyFetch, ICategory } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { Grid } from '@giphy/react-components'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  // eslint-disable-next-line no-unused-vars
  setGifAttachment: (gif: IGif) => void
}

const giphyFetch = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const Giphy: React.FC<Props> = ({ setGifAttachment }) => {
  const [showModal, setShowModal] = useState(false)
  const [categories, setCategories] = useState<Array<ICategory>>([])
  const [searchText, setSearchText] = useState('')

  const fetchGiphyCategories = async () => {
    const { data } = await giphyFetch.categories()
    // TODO: we can persist this categories
    setCategories(data)
  }

  useEffect(() => {
    fetchGiphyCategories()
  }, [])

  const fetchGifs = useCallback(
    (offset: number) => {
      return giphyFetch.search(searchText, { offset, limit: 10 })
    },
    [searchText]
  )

  const handleSearch = async (evt: any) => {
    let keyword = evt.target.value
    setSearchText(keyword)
  }

  const onCloseModal = () => {
    setShowModal(!showModal)
    setSearchText('')
  }

  const onSelectGif = (item: IGif) => {
    setGifAttachment(item)
    setSearchText('')
    setShowModal(false)
  }

  return (
    <>
      <Tooltip content="GIF">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          className="tab-focus-ring"
          onClick={() => setShowModal(!showModal)}
        >
          <div className="w-full text-brand-500">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <g>
                <path d="M19 10.5V8.8h-4.4v6.4h1.7v-2h2v-1.7h-2v-1H19zm-7.3-1.7h1.7v6.4h-1.7V8.8zm-3.6 1.6c.4 0 .9.2 1.2.5l1.2-1C9.9 9.2 9 8.8 8.1 8.8c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c1 0 1.8-.4 2.4-1.1v-2.5H7.7v1.2h1.2v.6c-.2.1-.5.2-.8.2-.9 0-1.6-.7-1.6-1.6 0-.8.7-1.6 1.6-1.6z"></path>
                <path d="M20.5 2.02h-17c-1.24 0-2.25 1.007-2.25 2.247v15.507c0 1.238 1.01 2.246 2.25 2.246h17c1.24 0 2.25-1.008 2.25-2.246V4.267c0-1.24-1.01-2.247-2.25-2.247zm.75 17.754c0 .41-.336.746-.75.746h-17c-.414 0-.75-.336-.75-.746V4.267c0-.412.336-.747.75-.747h17c.414 0 .75.335.75.747v15.507z"></path>
              </g>
            </svg>
          </div>
        </motion.button>
      </Tooltip>
      <Modal onClose={() => onCloseModal()} title="Select GIF" show={showModal}>
        <Input
          className="m-2"
          type="text"
          placeholder="Search for GIFs"
          value={searchText}
          onChange={handleSearch}
        />
        <div className="flex overflow-x-hidden overflow-y-auto h-96">
          {searchText ? (
            <Grid
              className="mx-1.5"
              onGifClick={(item) => onSelectGif(item)}
              fetchGifs={fetchGifs}
              width={490}
              hideAttribution
              columns={3}
              noLink
            />
          ) : (
            <div className="grid w-full grid-cols-2 gap-1 mx-1.5">
              {categories.map((category, idx) => (
                <button
                  key={idx}
                  className="relative flex outline-none"
                  onClick={() => setSearchText(category.name)}
                >
                  <img
                    className="object-cover w-full h-32 cursor-pointer rounded-xl"
                    src={category.gif?.images?.original_still.url}
                    alt=""
                    draggable={false}
                  />
                  <div className="absolute bottom-0 right-0 w-full px-2 py-1 text-lg font-bold text-right text-white rounded-b-xl from-transparent via-gray-800 to-gray-900 bg-gradient-to-b">
                    <span>{category.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default Giphy
