from typing import List, Optional

def parse_split_points(split_points_str: Optional[str]) -> List[int]:
    """Parse a comma-separated string of split points into a list of integers."""
    if not split_points_str:
        return []

    points = []
    for part in split_points_str.split(','):
        stripped = part.strip()
        if stripped.isdigit():
            points.append(int(stripped))
    return points
