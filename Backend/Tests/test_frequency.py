import pytest

from Data.Config import freq_max, freq_min


@pytest.mark.parametrize('frequency', [freq_min, 2e6, freq_max])
def test_put_frequency(client, frequency):
    before = client.get('/instrument/state').json

    response = client.put(
        '/instrument/frequency',
        json={'frequency': frequency},
    )

    assert response.status_code == 204
    assert response.data == b''

    state = client.get('/instrument/state')
    assert state.status_code == 200
    assert state.json == {**before, 'frequency': frequency}


@pytest.mark.parametrize('payload', [
    {'frequency': freq_min - 1},
    {'frequency': freq_max + 1},
    {},
    {'frequency': None},
    {'frequency': 'invalid'},
    {'frequency': []},
    {'frequency': {}},
])
def test_put_frequency_rejects_invalid_input(client, payload):
    before = client.get('/instrument/state').json

    response = client.put('/instrument/frequency', json=payload)

    assert response.status_code == 422
    assert 'frequency' in response.json['detail']['json']

    state = client.get('/instrument/state')
    assert state.status_code == 200
    assert state.json == before
