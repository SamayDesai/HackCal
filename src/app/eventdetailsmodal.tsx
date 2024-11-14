import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { updateDoc, Firestore, query, getDocs, where, collection } from "firebase/firestore";
import { Event } from "@/app/models";
import DatetimePickerHourCycle from "@/components/ui/date-time";
import dayjs, { Dayjs } from "dayjs";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  db: Firestore;
  userId: string;
}

export default function EventDetailsModal({ isOpen, onClose, event, db, userId }: EventDetailsModalProps) {
  const [eventName, setEventName] = useState(event.name);
  const [eventLocation, setEventLocation] = useState(event.location);
  const [description, setDescription] = useState(event.description);
//   const [startDate, setStartDate] = useState<Dayjs>(dayjs(event.start));
//   const [endDate, setEndDate] = useState<Dayjs>(dayjs(event.end));

  const handleUpdate = async () => {
    if (!db || !userId) return;

    const eventsRef = collection(db, "users", userId, "events");
    const q = query(eventsRef, where("name", "==", event.name));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnapshot) => {
        await updateDoc(docSnapshot.ref, {
        name: eventName,
        // start: startDate,
        // end: endDate,
        location: eventLocation,
        description: description,
        });
    });

    // setEvents((prevEvents) =>
    //   prevEvents.map((e) => (e.name === event.name ? { ...e, name: eventName, start: startDate, end: endDate, location: eventLocation, description } : e))
    // );

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Event Details</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>Event Name</FormLabel>
            <Input value={eventName} onChange={(e) => setEventName(e.target.value)} />
          </FormControl>
          {/* <DatetimePickerHourCycle
          selectedDate={startDate} onDateChange={(date) => date && setStartDate(date)} time="start"
          />
          <DatetimePickerHourCycle
          selectedDate={endDate}
          onDateChange={(date) => date && setEndDate(date)} time="end"
          /> */}
          <FormControl mt={4}>
            <FormLabel>Location</FormLabel>
            <Input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
            Update
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}