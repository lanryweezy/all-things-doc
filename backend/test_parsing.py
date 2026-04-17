from parsing_utils import parse_split_points

def test_parse_split_points_empty():
    assert parse_split_points("") == []
    assert parse_split_points(None) == []

def test_parse_split_points_single():
    assert parse_split_points("5") == [5]

def test_parse_split_points_multiple():
    assert parse_split_points("1,2,3") == [1, 2, 3]

def test_parse_split_points_with_spaces():
    assert parse_split_points(" 1 , 2, 3 ") == [1, 2, 3]

def test_parse_split_points_with_invalid():
    assert parse_split_points("1,a,2") == [1, 2]
    assert parse_split_points("1,,2") == [1, 2]
    assert parse_split_points("abc, def") == []

def test_parse_split_points_negative():
    assert parse_split_points("-1,5") == [5]

def test_parse_split_points_mixed_garbage():
    assert parse_split_points("1, 2.5, 3, , four, 5!") == [1, 3]
