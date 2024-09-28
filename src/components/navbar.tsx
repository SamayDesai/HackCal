'use client'

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons'

interface Props {
  children: React.ReactNode
}

const Links = ['Dashboard', 'Event List']

const NavLink = (props: Props) => {
  const { children } = props
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Box>
  )
}

export default function Navigation() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
                <Button>
                    HackCal
                </Button>
            </Box>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link}>
                    {link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={
                 "data:image/jpeg;base64,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" }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Account</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuDivider />
                <MenuItem>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box p={4}>Main Content Here</Box>
    </>
  )
}