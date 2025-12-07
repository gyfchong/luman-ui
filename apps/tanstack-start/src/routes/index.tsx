import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@luman-ui/core"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Button
        type="button"
        onClick={() => {
          alert("Activated!")
        }}
        variant="primary"
      >
        Activate
      </Button>
    </div>
  )
}
