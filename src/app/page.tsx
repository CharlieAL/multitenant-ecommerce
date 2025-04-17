import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Progress } from '~/components/ui/progress'
import { Textarea } from '~/components/ui/textarea'

export default function Home() {
  return (
    <div className='flex flex-col gap-y-4 px-10 py-10'>
      <div>
        <Button variant={'elevated'} type='button'>
          I am a button
        </Button>
      </div>
      <div>
        <Input value={'I am a input'} />
      </div>
      <div>
        <Textarea value={'I am a textarea'} />
      </div>
      <div>
        <Progress value={50} />
      </div>
    </div>
  )
}
