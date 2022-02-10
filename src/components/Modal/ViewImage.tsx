import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface IModalView {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: IModalView) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent
        mx="auto"
        w="auto"
        h="auto"
        maxW={["300px", "500px", "900px"]}
        maxH={["350px", "450px", "600px"]}
      >
        <ModalBody p="0">
          <Image
            src={imgUrl}
            maxW={["300px", "500px", "900px"]}
            maxH={["350px", "450px", "600px"]}
          />
        </ModalBody>

        <ModalFooter bg="pGray.800" h="2rem" px="20px" borderBottomRadius="5px">
          <Link href={imgUrl} isExternal fontSize="1rem" mr="auto">
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
