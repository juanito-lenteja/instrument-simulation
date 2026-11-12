from apiflask import Schema, fields
from apiflask.validators import Length, OneOf, Range

from Data.Config import (
    amplitude_range,
    freq_range,
    id_range,
    version_range,
)


class Id(Schema):
    id = fields.String(validate=OneOf(id_range), required=True)


class Frequency(Schema):
    frequency = fields.Float(validate=Range(*freq_range), required=True)


class Amplitude(Schema):
    amplitude = fields.Float(validate=Range(*amplitude_range), required=True)


class OutputEnabled(Schema):
    output_enabled = fields.Boolean(required=True)


class InstrumentStateOut(Id, Frequency, Amplitude, OutputEnabled):
    pass


class InstrumentInfoOut(Id):
    description = fields.String(required=True, validate=Length(max=256))
    firmware = fields.String(required=True, validate=OneOf(version_range))
