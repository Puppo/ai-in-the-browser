import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/prompt-api')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/prompt-api"!</div>
}
