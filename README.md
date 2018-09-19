# Train-Scheduler

Determines when the next train will arrive and the approximate time it will arrive on it's next nearest time that it reaches its stop.

Minor bug where if the frequency in minutes is greater than the amount of minutes in a day; the scheduler calculating the approximate time left till arrival will never reach 0 because days are not tracked. This can be fixed if the start time included days.
