id_range = ['SG-001']
freq_range = (1.0, 1e9)
freq_min, freq_max = freq_range
amplitude_range = (0.0, 10.0)
amplitude_min, amplitude_max = amplitude_range

id_default = 'SG-001'
assert id_default in id_range
freq_default = 1e6
assert freq_min <= freq_default <= freq_max
amplitude_default = 1.0
assert amplitude_min <= amplitude_default <= amplitude_max
output_enabled_default = False


version_range = ['v1', 'v2']

name_default = 'SG1G'
description_default = '1GHz Signal Generator'
version_default = 'v1'
assert version_default in version_range
