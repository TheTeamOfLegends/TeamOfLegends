import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

global.structuredClone = val => JSON.parse(JSON.stringify(val))

const config = defineConfig({
  theme: {},
})

const system = createSystem(defaultConfig, config)

export const renderWithProviders = (
  ui: React.ReactElement,
  { initialEntry = '/' } = {}
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <ChakraProvider value={system}>
        <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
      </ChakraProvider>
    ),
  })
}
