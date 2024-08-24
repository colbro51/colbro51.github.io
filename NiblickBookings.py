import PySimpleGUI as sg
import csv
import os

# Function to load data from CSV
def load_data(file_path):
    if os.path.exists(file_path):
        with open(file_path, mode='r', newline='') as file:
            reader = csv.reader(file)
            return list(reader)
    return []

# Function to save data to CSV
def save_data(file_path, data):
    with open(file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(data)

# Function to delete a row from the table
def delete_row(data, index):
    if 0 <= index < len(data):
        del data[index]
    return data

# Layout for Regular Hire tab
regular_hire_layout = [
    [sg.Frame('Regular Hire Details', [
        [sg.Text('Hirer'), sg.InputText(key='-RH_HIRER-')],
        [sg.Text('Start date'), sg.Input(key='-RH_START_DATE-'), sg.CalendarButton('Choose Date', target='-RH_START_DATE-', format='%Y-%m-%d')],
        [sg.Text('Stop date'), sg.Input(key='-RH_STOP_DATE-'), sg.CalendarButton('Choose Date', target='-RH_STOP_DATE-', format='%Y-%m-%d')],
        [sg.Text('Start hour'), sg.InputText(key='-RH_START_HOUR-')],
        [sg.Text('Stop hour'), sg.InputText(key='-RH_STOP_HOUR-')],
        [sg.Button('Add', key='-RH_ADD-')]
    ])],
    [sg.Frame('Regular Hire Table', [
        [sg.Table(values=load_data('regular_hire.csv'), headings=['Hirer', 'Start date', 'Stop date', 'Start hour', 'Stop hour', 'Delete'], key='-RH_TABLE-', enable_events=True, auto_size_columns=False, col_widths=[40, 15, 15, 10, 10, 10], justification='left')],
        [sg.Button('Save', key='-RH_SAVE-')]
    ])]
]

# Layout for Single Hire tab
single_hire_layout = [
    [sg.Frame('Single Hire Details', [
        [sg.Text('Hirer'), sg.InputText(key='-SH_HIRER-')],
        [sg.Text('Date'), sg.Input(key='-SH_DATE-'), sg.CalendarButton('Choose Date', target='-SH_DATE-', format='%Y-%m-%d')],
        [sg.Text('Start hour'), sg.InputText(key='-SH_START_HOUR-')],
        [sg.Text('Stop hour'), sg.InputText(key='-SH_STOP_HOUR-')],
        [sg.Button('Add', key='-SH_ADD-')]
    ])],
    [sg.Frame('Single Hire Table', [
        [sg.Table(values=load_data('single_hire.csv'), headings=['Hirer', 'Start date', 'Stop date', 'Start hour', 'Stop hour', 'Delete'], key='-SH_TABLE-', enable_events=True, auto_size_columns=False, col_widths=[40, 15, 15, 10, 10, 10], justification='left')],
        [sg.Button('Save', key='-SH_SAVE-')]
    ])]
]

# Layout for Display tab (to be described later)
display_layout = [
    [sg.Text('Display tab content will be added later')]
]

# Main layout with tabs
layout = [
    [sg.TabGroup([
        [sg.Tab('Regular Hire', regular_hire_layout), sg.Tab('Single Hire', single_hire_layout), sg.Tab('Display', display_layout)]
    ])]
]

# Create the window
window = sg.Window('Niblick Hall Bookings', layout)

# Event loop
while True:
    event, values = window.read()
    if event == sg.WINDOW_CLOSED:
        break
    elif event == '-RH_ADD-':
        new_entry = [values['-RH_HIRER-'], values['-RH_START_DATE-'], values['-RH_STOP_DATE-'], values['-RH_START_HOUR-'], values['-RH_STOP_HOUR-'], 'Del']
        data = window['-RH_TABLE-'].get()
        data.append(new_entry)
        window['-RH_TABLE-'].update(values=data)
    elif event == '-RH_SAVE-':
        data = window['-RH_TABLE-'].get()
        save_data('regular_hire.csv', data)
    elif event == '-SH_ADD-':
        new_entry = [values['-SH_HIRER-'], values['-SH_DATE-'], values['-SH_DATE-'], values['-SH_START_HOUR-'], values['-SH_STOP_HOUR-'], 'Del']
        data = window['-SH_TABLE-'].get()
        data.append(new_entry)
        window['-SH_TABLE-'].update(values=data)
    elif event == '-SH_SAVE-':
        data = window['-SH_TABLE-'].get()
        save_data('single_hire.csv', data)
    elif event.startswith('-RH_TABLE-'):
        if event.endswith('Del'):
            row_index = int(event.split('-')[2])
            data = window['-RH_TABLE-'].get()
            data = delete_row(data, row_index)
            window['-RH_TABLE-'].update(values=data)
    elif event.startswith('-SH_TABLE-'):
        if event.endswith('Del'):
            row_index = int(event.split('-')[2])
            data = window['-SH_TABLE-'].get()
            data = delete_row(data, row_index)
            window['-SH_TABLE-'].update(values=data)

window.close()
