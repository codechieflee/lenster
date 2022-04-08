import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import SettingsHelper from '@components/Shared/SettingsHelper'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { TextArea } from '@components/UI/TextArea'
import SEO from '@components/utils/SEO'
import { PencilAltIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { trackEvent } from '@lib/trackEvent'
import { useRouter } from 'next/router'
import React from 'react'
import { CONTACT_EMAIL } from 'src/constants'
import { object, string } from 'zod'

const newContactSchema = object({
  subject: string().max(260, {
    message: 'Subject should not exceed 260 characters'
  }),
  message: string().max(1000, {
    message: 'Message should not exceed 1000 characters'
  })
})

const Contact: React.FC = () => {
  const { push } = useRouter()
  const form = useZodForm({
    schema: newContactSchema
  })

  return (
    <GridLayout>
      <SEO title="Contact • Lenster" />
      <GridItemFour>
        <SettingsHelper
          heading="Contact Lenster"
          description="Contact us to help you get the issue resolved."
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          {false ? (
            <EmptyState
              message={<span>Publication reported successfully!</span>}
              icon={<CheckCircleIcon className="text-green-500 w-14 h-14" />}
              hideCard
            />
          ) : (
            <CardBody>
              <Form
                form={form}
                className="space-y-4"
                onSubmit={({ subject, message }) => {
                  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                    subject
                  )}&body=${encodeURIComponent(message)}`
                  trackEvent('contact')
                  push('/')
                }}
              >
                <Input
                  label="Subject"
                  placeholder="What happened?"
                  {...form.register('subject')}
                />
                <TextArea
                  label="Message"
                  placeholder="How can we help?"
                  {...form.register('message')}
                />
                <div className="ml-auto">
                  <Button
                    type="submit"
                    icon={<PencilAltIcon className="w-4 h-4" />}
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </CardBody>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default Contact
