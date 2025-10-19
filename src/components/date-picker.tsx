"use client"
import { DatePicker } from "@ark-ui/react/date-picker"
import { Portal } from "@ark-ui/react/portal"
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react"

interface DatePickerComponentProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  min?: string
  className?: string
}

export const DatePickerComponent = ({ 
  label = "Select Date", 
  placeholder = "MM/DD/YYYY",
  value,
  onChange,
  min,
  className = ""
}: DatePickerComponentProps) => {
  return (
    <div className={`w-full ${className}`}>
      <DatePicker.Root 
        onValueChange={(details) => {
          if (onChange && details.valueAsString && details.valueAsString.length > 0) {
            onChange(details.valueAsString[0])
          }
        }}
      >
        {label && (
          <DatePicker.Label className="block mb-2 text-sm font-medium text-gray-700">
            {label}
          </DatePicker.Label>
        )}

        <DatePicker.Control className="relative flex items-center gap-2 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
          <DatePicker.Input
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 px-3 py-2.5"
            placeholder={placeholder}
          />
          <div className="flex items-center pr-1">
            <DatePicker.ClearTrigger className="p-1 text-gray-400 rounded hover:bg-gray-100 hover:text-red-500">
              <X size={14} />
            </DatePicker.ClearTrigger>
            <DatePicker.Trigger className="p-1 text-gray-400 rounded hover:bg-gray-100">
              <Calendar size={16} />
            </DatePicker.Trigger>
          </div>
        </DatePicker.Control>

        <Portal>
          <DatePicker.Positioner className="z-[9999]">
            <DatePicker.Content className="z-[9999] w-full max-w-sm p-4 mt-2 bg-white border border-gray-200 shadow-xl rounded-2xl">
              <DatePicker.View view="day">
                <DatePicker.Context>
                  {(datePicker) => (
                    <>
                      <DatePicker.ViewControl className="flex items-center justify-between mb-4">
                        <DatePicker.PrevTrigger className="p-2 transition-colors rounded-lg hover:bg-purple-50 hover:text-purple-600">
                          <ChevronLeft size={18} />
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger className="px-3 py-1 font-medium transition-colors rounded-md cursor-pointer hover:bg-purple-50 hover:text-purple-600">
                          <DatePicker.RangeText />
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger className="p-2 transition-colors rounded-lg hover:bg-purple-50 hover:text-purple-600">
                          <ChevronRight size={18} />
                        </DatePicker.NextTrigger>
                      </DatePicker.ViewControl>

                      <DatePicker.Table className="w-full text-sm text-center">
                        <DatePicker.TableHead>
                          <DatePicker.TableRow>
                            {datePicker.weekDays.map((weekDay, id) => (
                              <DatePicker.TableHeader
                                key={id}
                                className="text-xs font-medium text-gray-500 w-9 h-9"
                              >
                                {weekDay.short}
                              </DatePicker.TableHeader>
                            ))}
                          </DatePicker.TableRow>
                        </DatePicker.TableHead>
                        <DatePicker.TableBody>
                          {datePicker.weeks.map((week, id) => (
                            <DatePicker.TableRow key={id}>
                              {week.map((day, id) => (
                                <DatePicker.TableCell key={id} value={day}>
                                  <DatePicker.TableCellTrigger className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-purple-100 focus:ring-2 focus:ring-purple-500 data-[selected]:bg-purple-600 data-[selected]:text-white data-[today]:bg-purple-50 data-[today]:text-purple-600 transition-colors">
                                    {day.day}
                                  </DatePicker.TableCellTrigger>
                                </DatePicker.TableCell>
                              ))}
                            </DatePicker.TableRow>
                          ))}
                        </DatePicker.TableBody>
                      </DatePicker.Table>
                    </>
                  )}
                </DatePicker.Context>
              </DatePicker.View>
            </DatePicker.Content>
          </DatePicker.Positioner>
        </Portal>
      </DatePicker.Root>
    </div>
  )
}

// Backward compatibility
export const Basic = () => <DatePickerComponent />