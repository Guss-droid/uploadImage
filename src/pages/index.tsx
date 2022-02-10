import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface IImage {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface IGetImages {
  after: string;
  data: IImage[];
}

export default function Home(): JSX.Element {

  async function fetchingImages({ pageParam = null }): Promise<IGetImages> {
    const { data } = await api.get("/api/images", {
      params: {
        after: pageParam,
      },
    })

    return data
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery("images", fetchingImages, {
    getNextPageParam: lastPage => lastPage?.after || null
  });

  const formattedData = useMemo(() => {
    const format = data?.pages.flatMap(formatData => {
      return formatData.data.flat();
    })

    return format
  }, [data]);

  if (isLoading && !isError) {
    return <Loading />
  }

  if (!isLoading && isError) {
    return <Error />
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          mt="6"
          >
            {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
          </Button>
        )}
      </Box>
    </>
  );
}
