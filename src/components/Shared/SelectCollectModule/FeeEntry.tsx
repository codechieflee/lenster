import { Button } from '@components/UI/Button'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import AppContext from '@components/utils/AppContext'
import { EnabledModule, Erc20 } from '@generated/types'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { FEE_DATA_TYPE } from '@lib/getModule'
import { Dispatch, useContext, useState } from 'react'
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
    .min(1, { message: 'Invalid referralFee' })
    .max(20, { message: 'Invalid referralFee' })
})

interface Props {
  enabledModuleCurrencies: Erc20[]
  selectedModule: EnabledModule
  setShowFeeEntry: Dispatch<React.SetStateAction<boolean>>
  setShowModal: Dispatch<React.SetStateAction<boolean>>
  feeData: FEE_DATA_TYPE
  setFeeData: React.Dispatch<React.SetStateAction<FEE_DATA_TYPE>>
}

const FeeEntry: React.FC<Props> = ({
  enabledModuleCurrencies,
  selectedModule,
  setShowFeeEntry,
  setShowModal,
  feeData,
  setFeeData
}) => {
  const { currentUser } = useContext(AppContext)
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
  )
  const form = useZodForm({
    schema: feeDataSchema,
    defaultValues: {
      value: feeData.amount.value,
      referralFee: feeData.referralFee.toString()
    }
  })

  return (
    <div className="space-y-5">
      <button
        className="flex items-center space-x-1.5 font-bold text-gray-500"
        onClick={() => setShowFeeEntry(false)}
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <div>Back</div>
      </button>
      <Form form={form} className="space-y-4" onSubmit={({}) => {}}>
        <div>
          <div className="mb-1 font-medium text-gray-800 dark:text-gray-200">
            Select Currency
          </div>
          <select
            className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 dark:border-gray-700 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 focus:border-brand-500 focus:ring-brand-400"
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            {enabledModuleCurrencies.map((currency: Erc20) => (
              <option key={currency.symbol} value={currency.address}>
                {currency.name}
              </option>
            ))}
          </select>
        </div>
        {(selectedModule.moduleName === 'LimitedFeeCollectModule' ||
          selectedModule.moduleName === 'LimitedTimedFeeCollectModule') && (
          <Input
            label="Collect Limit"
            type="number"
            placeholder="5"
            {...form.register('collectLimit')}
          />
        )}
        <Input
          label="Amount"
          type="number"
          placeholder="0.5"
          {...form.register('value')}
        />
        <Input
          label="Referral Fee"
          type="number"
          placeholder="5%"
          {...form.register('referralFee')}
        />
        <Button
          type="button"
          onClick={() => {
            setFeeData({
              amount: {
                currency: selectedCurrency,
                value: form.getValues('value')
              },
              collectLimit: form.getValues('collectLimit'),
              recipient: currentUser?.ownedBy,
              referralFee: parseFloat(form.getValues('referralFee'))
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
