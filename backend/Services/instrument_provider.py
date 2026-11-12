from Data.Classes import Instrument


instrument = None


def _instantiate_instrument():
    global instrument
    if instrument is None:
        instrument = Instrument()


def get_instrument():
    _instantiate_instrument()
    return instrument


def get_instrument_transient():
    return Instrument()
