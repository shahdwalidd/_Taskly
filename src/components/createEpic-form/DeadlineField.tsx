import { getTodayISO} from "@/utils/formatDate"
import ErrorIcon from "@/assets/erroricon.svg?react"
interface DeadlineFieldProps {
  id: string
  value: string 
  onChange: (value: string) => void
  error?: string
}
 export function DeadlineField({id,value,onChange,error}:DeadlineFieldProps){

return(

<div className="flex flex-col gap-4">
    <label htmlFor={id} className="text-label-sm text-grey uppercase"> Deadline
</label>
<input  id={id } type="date" className="bg-surface-highest rounded-sm px-4 py-3 "        value={value}
        min={getTodayISO()}
        onChange={(event) => onChange(event.target.value)}/>
 {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-label-sm flex items-center gap-2 uppercase text-error"
        >
          <ErrorIcon/>
          {error}
        </p>
      )}
</div>













)











 }