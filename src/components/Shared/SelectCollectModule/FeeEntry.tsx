import { Button } from '@components/UI/Button'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { EnabledModule, Erc20 } from '@generated/types'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { defaultModuleData, FEE_DATA_TYPE } from '@lib/getModule'
import { Dispatch, FC, useState } from 'react'
import { DEFAULT_COLLECT_TOKEN } from 'src/constants'
import { useAppPersistStore } from 'src/store/app'
import { object, string } from 'zod'

const feeDataSchema = object({
  collectLimit: string()
    .min(1, { message: 'Invalid value' })
    .max(20, { message: 'Invalid value' })
    .nullable(),
  value: string()
    .min(1, { message: 'Invalid value' })
    .max(20, { message: 'Invalid value' }),
  referralFee: string()
    .min(1, { message: 'Invalid Referral fee' })
    .max(20, { message: 'Invalid Referral fee' })
})

interface Props {
  enabledModuleCurrencies: Erc20[]
  selectedModule: EnabledModule
  setSelectedModule: Dispatch<EnabledModule>
  setShowFeeEntry: Dispatch<boolean>
  setShowModal: Dispatch<boolean>
  feeData: FEE_DATA_TYPE
  setFeeData: Dispatch<FEE_DATA_TYPE>
}

const FeeEntry: FC<Props> = ({
  enabledModuleCurrencies,
  selectedModule,
  setSelectedModule,
  setShowFeeEntry,
  setShowModal,
  feeData,
  setFeeData
}) => {
  const { currentUser } = useAppPersistStore()
  const [followerOnly, setFollowerOnly] = useState<boolean>(false)
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    DEFAULT_COLLECT_TOKEN
  )
  const form = useZodForm({
    schema: feeDataSchema,
    defaultValues: {
      value: feeData.amount.value,
      referralFee: feeData.referralFee.toString()
    }
  })

  const showCollect =
    selectedModule.moduleName === 'LimitedFeeCollectModule' ||
    selectedModule.moduleName === 'LimitedTimedFeeCollectModule'

  return (
    <div className="space-y-5">
      <button
        type="button"
        className="flex items-center space-x-1.5 font-bold text-gray-500"
        onClick={() => {
          setSelectedModule(defaultModuleData)
          setShowFeeEntry(false)
        }}
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <div>Back</div>
      </button>
      <Form form={form} className="space-y-4" onSubmit={({}) => {}}>
        <div>
          <div className="label">Select Currency</div>
          <select
            className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            {enabledModuleCurrencies.map((currency: Erc20) => (
              <option key={currency.address} value={currency.address}>
                {currency.name}
              </option>
            ))}
          </select>
        </div>
        {showCollect && (
          <Input
            label="Collect Limit"
            type="number"
            placeholder="5"
            min="0"
            max="100000"
            {...form.register('collectLimit')}
          />
        )}
        <Input
          label="Amount"
          type="number"
          placeholder="0.5"
          min="0"
          max="100000"
          {...form.register('value')}
        />
        <Input
          label="Referral Fee"
          helper={
            <span>
              When someone mirrors the publication they will get some reward in
              percentage for referring it.
            </span>
          }
          type="number"
          placeholder="5%"
          min="0"
          max="100"
          {...form.register('referralFee')}
        />
        <div>
          <div className="label">Permission</div>
          <select
            className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
            onChange={(e) => setFollowerOnly(e.target.value === 'true')}
          >
            <option value="false">Everyone can collect</option>
            <option value="true">Only followers can collect</option>
          </select>
        </div>
        <Button
          type="button"
          disabled={
            !form.watch('value') ||
            parseFloat(form.watch('value')) <= 0 ||
            (showCollect
              ? !form.watch('collectLimit') || form.watch('collectLimit') == '0'
              : false)
          }
          onClick={() => {
            setFeeData({
              amount: {
                currency: selectedCurrency,
                value: form.getValues('value')
              },
              collectLimit: form.getValues('collectLimit'),
              recipient: currentUser?.ownedBy,
              referralFee: parseFloat(form.getValues('referralFee')),
              followerOnly: followerOnly
            })
            setShowModal(false)
          }}
        >
          Save
        </Button>
      </Form>
    </div>
  )
}

export default FeeEntry
