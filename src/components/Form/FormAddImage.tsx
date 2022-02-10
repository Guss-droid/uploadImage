import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface INewImage {
  url: string;
  title: string;
  description: string;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('')
  const [localImageUrl, setLocalImageUrl] = useState('')
  const toast = useToast()

  const regexImages =
    /(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#](?:jpeg|gif|png))(?:\?([^#]*))?(?:#(.*))?/g

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: fileList =>
          fileList[0].size < 10000000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: fileList =>
          regexImages.test(fileList[0].type) || 'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: 'Título obrigatório',
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres',
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      },
    },
  }

  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (imageData: INewImage) => {
      await api.post("/api/images", {
        ...imageData,
        url: imageUrl,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images')
      },
    }
  )

  const {
    reset,
    trigger,
    setError,
    register,
    formState,
    handleSubmit,
  } = useForm()
  const { errors } = formState

  const onSubmit = async (data: INewImage): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          status: 'error',
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
        })

        return
      }
      await mutation.mutateAsync(data)

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        status: 'success',
      })
    } catch {
      toast({
        status: 'error',
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
      })
    } finally {
      reset()
      setImageUrl('')
      setLocalImageUrl('')
      closeModal()
    }
  }

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}