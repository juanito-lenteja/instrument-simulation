import pytest

from Data.Config import amplitude_max, amplitude_min


@pytest.mark.parametrize('amplitude', [amplitude_min, 2.0, amplitude_max])
def test_put_amplitude(client, amplitude):
    before = client.get('/instrument/state').json

    response = client.put(
        '/instrument/amplitude',
        json={'amplitude': amplitude},
    )

    assert response.status_code == 204
    assert response.data == b''

    state = client.get('/instrument/state')
    assert state.status_code == 200
    assert state.json == {**before, 'amplitude': amplitude}


@pytest.mark.parametrize('payload', [
    {'amplitude': amplitude_min - 1},
    {'amplitude': amplitude_max + 1},
    {},
    {'amplitude': None},
    {'amplitude': 'invalid'},
    {'amplitude': []},
    {'amplitude': {}},
])
def test_put_amplitude_rejects_invalid_input(client, payload):
    before = client.get('/instrument/state').json

    response = client.put('/instrument/amplitude', json=payload)

    assert response.status_code == 422
    assert 'amplitude' in response.json['detail']['json']

    state = client.get('/instrument/state')
    assert state.status_code == 200
    assert state.json == before
