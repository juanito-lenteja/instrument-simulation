import pytest

from Data.Config import (
    amplitude_default,
    description_default,
    freq_default,
    id_default,
    output_enabled_default,
    version_default,
)


def test_get_instrument_info(client):
    response = client.get('/instrument')

    assert response.status_code == 200
    assert response.json == {
        'id': id_default,
        'description': description_default,
        'firmware': version_default,
    }


def test_get_instrument_state(client):
    response = client.get('/instrument/state')

    assert response.status_code == 200
    assert response.json == {
        'id': id_default,
        'frequency': freq_default,
        'amplitude': amplitude_default,
        'output_enabled': output_enabled_default,
    }


@pytest.mark.parametrize('field, value', [
    ('frequency', -1),
    ('amplitude', -1),
    ('output_enabled', 'invalid'),
])
def test_instrument_remains_consistent_after_invalid_put(client, field, value):
    updates = {
        'frequency': 2e6,
        'amplitude': 2.0,
        'output_enabled': True,
    }
    for name, valid_value in updates.items():
        response = client.put(
            f'/instrument/{name}',
            json={name: valid_value},
        )
        assert response.status_code == 204

    info_before = client.get('/instrument')
    state_before = client.get('/instrument/state')
    assert info_before.status_code == 200
    assert state_before.status_code == 200
    assert state_before.json == {'id': id_default, **updates}

    response = client.put(f'/instrument/{field}', json={field: value})

    assert response.status_code == 422
    assert field in response.json['detail']['json']

    info_after = client.get('/instrument')
    state_after = client.get('/instrument/state')
    assert info_after.status_code == 200
    assert state_after.status_code == 200
    assert info_after.json == info_before.json
    assert state_after.json == state_before.json
