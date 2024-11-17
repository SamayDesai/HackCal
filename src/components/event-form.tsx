
'use client'
import { useEffect, useState } from 'react'
import FileUpload from '@/components/ui/file-upload';
import DatetimePickerHourCycle from './ui/date-time';
import dayjs, { Dayjs } from 'dayjs';

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
  SimpleGrid,
  Textarea,
} from '@chakra-ui/react'


import { useToast } from '@chakra-ui/react'
import { InitFirestore, WriteNewEvent } from '@/app/firebase/firestore';
import { collection, Firestore, getDocs, query, where } from 'firebase/firestore';

async function ProcessImage(file: string, db: Firestore | undefined,
userId: string, toast: any) {
  try {
    const response = await fetch('api/process-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file }),
    });

    if (!response.ok) {
      throw new Error('Failed to process image');
    }

    const data = await response.json();
    const newEvents = data.events;

    if (db && userId) {
      for (const event of newEvents) {
        const eventsRef = collection(db, "users", userId, "events");
        const q = query(eventsRef, where("name", "==", event.name));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          await WriteNewEvent(db, userId, event);
        } else {
          toast({
            title: `An event with name ${event.name} is already in the table`,
            description: "Your event names must be unique!",
            status: 'error',
            duration: 10000,
            isClosable: true,
          });
        }

      }
    }
  } catch (error) {
    console.error(error);
  }
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

const Form2 = ({
  eventName, setEventName,
  eventLocation, setEventLocation,
  startDate, setStartDate,
  endDate, setEndDate,
  description, setDescription
}: any) => {
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal">
        Confirm Event Details
      </Heading>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl as={GridItem} colSpan={[2, 2]}>
          <FormLabel>Event Name</FormLabel>
          <Input
            type="text"
            placeholder="My Birthday Party!"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </FormControl>
        <FormControl as={GridItem} colSpan={[2, 2]}>
          <FormLabel>Event Location</FormLabel>
          <Input
            type="text"
            placeholder="Location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />
        </FormControl>
        <DatetimePickerHourCycle
          selectedDate={startDate}
          onDateChange={setStartDate}
          time="start"
        />
        <DatetimePickerHourCycle
          selectedDate={endDate}
          onDateChange={setEndDate}
          time="end"
        />
        <FormControl as={GridItem} colSpan={[2, 2]}>
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
      </SimpleGrid>
    </>
  );
}

export default function EventForm({ events, setEvents, setIsEventsUpdated, userId }: any) {
  const toast = useToast()
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(50)
  const [file, setFile] = useState("")
  const [db, setDb] = useState<Firestore>();
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [description, setDescription] = useState("");
  useEffect(() => {
    setDb(InitFirestore())
  }, []) // TODO: Remove empty array param


  const handleClick = async () => {
    if (userId) {
      if (file !== "") {
        setStep(step + 1)
        if (step === 3) {
          setProgress(100)
        } else {
          setProgress(progress + 50)
        }
        await ProcessImage(file, db, userId, toast)
        setIsEventsUpdated(true)
      }
    }
    else {
      toast({
        title: 'Please log in!',
        description: "You must log in before uploading a picture.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
        {step === 1 ? (
          <Form1 file={file} setFile={setFile} />
        ) : (
          <Form2
            eventName={eventName}
            setEventName={setEventName}
            eventLocation={eventLocation}
            setEventLocation={setEventLocation}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            description={description}
            setDescription={setDescription}
          />
        )}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1)
                  setProgress(progress - 50)
                }}
                isDisabled={step === 1 && file.length == 0}
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
                onClick={async () => {
                  const newEvent = {
                    name: eventName,
                    location: eventLocation,
                    start: startDate,
                    end: endDate,
                    description: description,
                  };

                  if (db && userId && eventName) {
                    const eventsRef = collection(db, "users", userId, "events");
                    const q = query(eventsRef, where("name", "==", eventName));
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.empty) {
                      const user = `${userId}`;
                      WriteNewEvent(db, user, newEvent);
                      console.log(userId);
                      setEvents([...events, newEvent]);
                      setIsEventsUpdated(true);
                
                      toast({
                        title: 'Event Uploaded',
                        description: "We've successfully uploaded your event!",
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                      });
                    }
                    else {
                      toast({
                        title: 'Event Not Uploaded',
                        description: "You already have an event with that name!",
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                      });
                    }
                  } else if (userId === undefined) {
                    toast({
                      title: 'Event Not Uploaded',
                      description: "Please log in to upload an event!",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                  else if (eventName === "") {
                    toast({
                      title: 'Event Not Uploaded',
                      description: "Please give your event a name!",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                }}
              >
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  )
}