from Data.Config import (
    amplitude_default,
    amplitude_range,
    description_default,
    freq_default,
    freq_range,
    id_default,
    output_enabled_default,
    version_default,
)


class Instrument():
    def __init__(
            self,
            id : str = id_default,
            description : str = description_default,
            firmware : str = version_default,
            frequency : float = freq_default, 
            amplitude : float = amplitude_default, 
            output_enabled : bool = output_enabled_default):
        self.id = id
        self.description = description
        self.firmware = firmware
        self.frequency = frequency
        self.amplitude = amplitude
        self.output_enabled = output_enabled

    def __is_num_bound(self, num, min, max):
        return min <= num <= max

    def get_id(self) -> str:
        return self.id

    def get_description(self) -> str:
        return self.description 

    def get_firmware(self) -> str:
        return self.firmware

    def set_frequency(self, frequency : float) -> bool:
        if not self.__is_num_bound(frequency, *freq_range):
            return False
        self.frequency = frequency
        return True

    def get_frequency(self) -> float:
        return self.frequency

    def set_amplitude(self, amplitude : float) -> bool:
        if not self.__is_num_bound(amplitude, *amplitude_range):
            return False
        self.amplitude = amplitude
        return True

    def get_amplitude(self) -> float:
        return self.amplitude

    def set_output_enabled(self, output_enabled : bool) -> bool:
        self.output_enabled = output_enabled
        return True

    def get_output_enabled(self):
        return self.output_enabled
