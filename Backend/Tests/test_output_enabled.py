import pytest


@pytest.mark.parametrize('output_enabled', [True, False])
def test_put_output_enabled(client, output_enabled):
    response = client.put(
        '/instrument/output_enabled',
        json={'output_enabled': not output_enabled},
    )
    assert response.status_code == 204
    before = client.get('/instrument/state').json

    response = client.put(
        '/instrument/output_enabled',
        json={'output_enabled': output_enabled},
    )

    assert response.status_code == 204
    assert response.data == b''

    state = client.get('/instrument/state')
    assert state.status_code == 200
    assert state.json == {**before, 'output_enabled': output_enabled}


@pytest.mark.parametrize('payload', [
    {},
    {'output_enabled': None},
    {'output_enabled': 'invalid'},
    {'output_enabled': 2},
    {'output_enabled': []},
    {'output_enabled': {}},
])
def test_put_output_enabled_rejects_invalid_input(client, payload):
    before = client.get('/instrument/state').json

    response = client.put('/instrument/output_enabled', json=payload)

    assert response.status_code == 422
    assert 'output_enabled' in response.json['detail']['json']

    state = client.get('/instrument/state')
    assert state.status_code == 200
    assert state.json == before
