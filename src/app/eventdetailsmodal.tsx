import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import {
  updateDoc,
  Firestore,
  query,
  getDocs,
  where,
  collection,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { Event } from "@/app/models";
import dayjs, { Dayjs } from "dayjs";
import DatetimePickerHourCycle from "@/components/ui/date-time";
import { WriteNewEvent } from "./firebase/firestore";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  db: Firestore;
  userId: string;
}

export default function EventDetailsModal({
  isOpen,
  onClose,
  event,
  db,
  userId,
}: EventDetailsModalProps) {
  const [eventName, setEventName] = useState(event.name);
  const [eventLocation, setEventLocation] = useState(event.location);
  const [description, setDescription] = useState(event.description);
  const [eventStart, setStartDate] = useState<Dayjs>(dayjs(event.start));
  const [eventEnd, setEndDate] = useState<Dayjs>(dayjs(event.end));

  const [isNameTouched, setIsNameTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();

  const removeEvent = async (eventName: string) => {
    if (!db || !userId) {
        console.error("Database or user ID not available");
        return;
    }
  
    try {
      const eventsCollection = collection(db, "users", userId, "events");
      
      const q = query(eventsCollection, where("name", "==", eventName));
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log(`No event found with name '${eventName}'`);
        return;
      }
  
      const deletePromises = querySnapshot.docs.map((docSnapshot) => deleteDoc(docSnapshot.ref));
      
      await Promise.all(deletePromises);
      
      console.log(`Deleted ${querySnapshot.size} event(s) with name '${eventName}'`);

  
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setEventName(event.name);
      setEventLocation(event.location);
      setDescription(event.description);
      setIsNameTouched(false);
      setErrorMessage(null);
      setIsUpdating(false);
    }
  }, [isOpen, event]);

  const isEventNameValid = eventName.trim() !== "";

  const handleUpdate = async () => {
    if (!db || !userId) {
      toast({
        title: "Missing Information",
        description: "Database connection or user ID is missing.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!isEventNameValid) {
      setErrorMessage("Event name cannot be empty.");
      return;
    }

    setIsUpdating(true);
    setErrorMessage(null);

    try {
      if (eventName.trim() !== event.name.trim()) {
        const eventsRef = collection(db, "users", userId, "events");
        const q = query(eventsRef, where("name", "==", eventName.trim()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setErrorMessage("An event with this name already exists. Please choose another name!");
          setIsUpdating(false);
          return;
        }
      }

      const eventDocRef = collection(db, "users", userId, "events");
      const eventQuery = query(
        eventDocRef,
        where("name", "==", event.name.trim())
      );
      const eventSnapshot = await getDocs(eventQuery);

      if (eventSnapshot.empty) {
        toast({
          title: "Event Not Found",
          description: "The event you are trying to update does not exist.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsUpdating(false);
        return;
      }

      const eventDoc = eventSnapshot.docs[0];

      const newEvent = {
        name: eventName,
        location: eventLocation,
        start: eventStart,
        end: eventEnd,
        description: description,
      };

      await removeEvent(eventName);
      await WriteNewEvent(db, userId, newEvent);


      // await updateDoc(eventDoc.ref, {
      //   name: eventName.trim(),
      //   location: eventLocation.trim(),
      //   description: description.trim(),
      //   start: eventStart,
      //   end: eventEnd,
      // });

      toast({
        title: "Event Updated",
        description: "Your event has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.log(error);
      console.error("Error updating event:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your event. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Event Details</ModalHeader>
        <ModalBody>
          <FormControl
            isRequired
            isInvalid={
              (!!errorMessage &&
                (eventName.trim() === "" ||
                  errorMessage.includes("already exists"))) ||
              (!isEventNameValid && isNameTouched)
            }
          >
            <FormLabel>Event Name</FormLabel>
            <Input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              onBlur={() => setIsNameTouched(true)}
              placeholder="Enter event name"
            />
            {errorMessage && (
              <FormErrorMessage>{errorMessage}</FormErrorMessage>
            )}
          </FormControl>

          
          <DatetimePickerHourCycle
            selectedDate={eventStart}
            onDateChange={(date) => date && setStartDate(date)}
            time="start"
          />
          <DatetimePickerHourCycle
            selectedDate={eventEnd}
            onDateChange={(date) => date && setEndDate(date)}
            time="end"
          />

          <FormControl mt={4}>
            <FormLabel>Location</FormLabel>
            <Input
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Enter location"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleUpdate}
            isDisabled={isUpdating}
            isLoading={isUpdating}
          >
            Update
          </Button>
          <Button onClick={onClose} isDisabled={isUpdating}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}