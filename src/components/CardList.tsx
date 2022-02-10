import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface ICard {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface ICardsProps {
  cards: ICard[];
}

export function CardList({ cards }: ICardsProps): JSX.Element {
  const { onOpen, isOpen, onClose, } = useDisclosure()
  const [imageUrl, setImageUrl] = useState('')

  function handleViewImage(url: string) {
    onOpen()
    setImageUrl(url)
  }

  return (
    <>
      <SimpleGrid columns={[1, 2, 3]} spacing="10">
        {cards.map(card => (
          <Card
            key={card.id}
            data={card}
            viewImage={handleViewImage}
          />
        ))}
      </SimpleGrid>

      <ModalViewImage
        isOpen={isOpen}
        imgUrl={imageUrl}
        onClose={onClose}
      />
    </>
  );
}
