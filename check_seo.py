import re

with open('src/types.ts', 'r') as f:
    content = f.read()
    all_tool_ids = re.findall(r'([A-Z_]+)\s*=\s*\'', content)

with open('src/seo-constants.ts', 'r') as f:
    content = f.read()
    seo_tool_ids = re.findall(r'\[ToolID\.([A-Z_]+)\]', content)

missing = [tid for tid in all_tool_ids if tid not in seo_tool_ids and tid not in ['AI_TOOLS', 'PDF_TOOLS', 'OFFICE_TOOLS', 'DEVELOPER_TOOLS', 'MEDIA_TOOLS']]
print("\n".join(missing))
