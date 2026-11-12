from apiflask import APIFlask

from Data.Classes import Instrument
from Data.Schemas import (
    Amplitude,
    Frequency,
    InstrumentInfoOut,
    InstrumentStateOut,
    OutputEnabled,
)


def register_routes(app : APIFlask, instrument : Instrument):
    @app.get('/instrument')
    @app.output(InstrumentInfoOut)
    def get_instrument_info():
        return instrument

    @app.get('/instrument/state')
    @app.output(InstrumentStateOut)
    def get_instrument_state():
        return instrument

    @app.put('/instrument/frequency')
    @app.input(Frequency)
    def set_instrument_frequency(json_data):
        instrument.set_frequency(json_data['frequency'])
        return '', 204

    @app.put('/instrument/amplitude')
    @app.input(Amplitude)
    def set_instrument_amplitude(json_data):
        instrument.set_amplitude(json_data['amplitude'])
        return '', 204

    @app.put('/instrument/output_enabled')
    @app.input(OutputEnabled)
    def set_instrument_output_enabled(json_data):
        instrument.set_output_enabled(json_data['output_enabled'])
        return '', 204
