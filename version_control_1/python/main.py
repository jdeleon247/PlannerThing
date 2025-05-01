# Starter hello world

from nicegui import ui

ui.label('Hello NiceGUI!')

with(ui.timeline(side='right')):
        ui.timeline_entry(ui.textarea(label='Text', placeholder='start typing',
            on_change=lambda e: result.set_text('you typed: ' + e.value)))
        result = ui.label()




ui.run()