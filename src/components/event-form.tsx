
'use client'
import { useState } from 'react'
import FileUpload from '@/components/ui/file-upload';
import DatetimePickerHourCycle from './ui/date-time';

import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  InputRightElement,
} from '@chakra-ui/react'

import { useToast } from '@chakra-ui/react'
import { InitOpenAi, ProcessImageRequest } from '@/app/openai';
import { Event } from '@/app/models';

async function ProcessImage(file: string, events: Event[], setEvents: (events: Event[]) => void) {
    let openai = await InitOpenAi()
    let newEvents = await ProcessImageRequest(openai, file)
    setEvents(newEvents.concat(events))
    return ""
}


const Form1 = ({ file, setFile }: any) => {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
        Scan Your Picture!
      </Heading>
      <FileUpload file={file} setFile={setFile} >

      </FileUpload>

    </>


  )
}

const Form2 = () => {
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal">
        Confirm Event Details
      </Heading>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl as={GridItem} colSpan={[2, 2]}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: 'gray.50',
            }}>
            Event Name
          </FormLabel>
          <InputGroup size="sm">
            <Input
              type="tel"
              placeholder="My Birthday Party!"
              focusBorderColor="brand.400"
              rounded="md"
            />
          </InputGroup>
        </FormControl>
        <FormControl as={GridItem} colSpan={[2, 2]}>

          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex w-72 flex-col">
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}>Start Date</FormLabel>
              <DatetimePickerHourCycle>

              </DatetimePickerHourCycle>
            </div>
            <div className="flex w-72 flex-col">
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}>End Date</FormLabel>
              <DatetimePickerHourCycle>

              </DatetimePickerHourCycle>
            </div>
          </div>

          {/* location and  */}
          <FormControl as={GridItem} colSpan={[2, 2]} paddingTop={5}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}>
              Event Location
            </FormLabel>
            <InputGroup size="sm">
              <Input
                type="tel"
                placeholder="Mickey Mouse's Club House!!"
                focusBorderColor="brand.400"
                rounded="md"
              />
            </InputGroup>
          </FormControl>
        </FormControl>

        <FormControl as={GridItem} colSpan={[2, 2]}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: 'gray.50',
            }}>
            Description
          </FormLabel>
          <Textarea
            placeholder="I love HackCal!!!"
            rows={3}
            shadow="sm"
            focusBorderColor="brand.400"
            fontSize={{
              sm: 'sm',
            }}
          />
        </FormControl>

      </SimpleGrid>
    </>
  )
}

export default function EventForm({ events, setEvents, setIsEventsUpdated }: any) {
  const toast = useToast()
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(50)
  const [file, setFile] = useState("")

  const handleClick = async () => {
                  if (file !== "") {
                    setStep(step + 1)
                    if (step === 3) {
                      setProgress(100)
                    } else {
                      setProgress(progress + 50)
                    }

                    await ProcessImage(file, events, setEvents)
                    setIsEventsUpdated(true)
                  }
  }

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form">
        <Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated></Progress>
        {step === 1 ? <Form1 file={file} setFile={setFile} /> : step === 2 ? <Form2 /> : <Form2 />}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1)
                  setProgress(progress - 50)
                }}
                isDisabled={step === 1}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%">
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 2}
                onClick={handleClick}
                colorScheme="teal"
                variant="outline">
                Next
              </Button>
            </Flex>
            {step === 2 ? (
              <Button
                w="7rem"
                colorScheme="teal"
                variant="solid"
                onClick={() => {
                  toast({
                    title: 'Event Uploaded',
                    description: "We've successfully uploaded your event!",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                }}>
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  )
}