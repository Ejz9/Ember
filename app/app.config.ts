export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'purple',
      neutral: 'neutral'
    },
    card: {
      slots: {
        root: 'rounded-lg overflow-hidden text-left',
        header: 'p-4 sm:px-6',
        body: 'p-4 sm:p-6',
        footer: 'p-4 sm:px-6'
      },
      variants: {
        variant: {
          outline: {
            root: 'bg-white/75 dark:bg-neutral-900/75 backdrop-blur-lg transition-all duration-200 hover:bg-white/90 dark:hover:bg-neutral-900/90 hover:ring-2 hover:ring-primary-500'
          },
          solid: {
            root: 'bg-inverted text-inverted'
          },
          soft: {
            root: 'bg-elevated/50 divide-y divide-default'
          },
          subtle: {
            root: 'bg-elevated/50 ring ring-default divide-y divide-default'
          }
        }
      },
      defaultVariants: {
        variant: 'outline'
      }
    }
  }
})
