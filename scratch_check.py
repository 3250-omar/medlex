import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

for lang in ['en', 'ar']:
    with open(f'lib/i18n/translations/{lang}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    def walk(obj, path=''):
        res = []
        if isinstance(obj, dict):
            for k, v in obj.items():
                res.extend(walk(v, f'{path}.{k}' if path else k))
        elif isinstance(obj, list):
            for i, v in enumerate(obj):
                res.extend(walk(v, f'{path}[{i}]'))
        elif isinstance(obj, str):
            # check if period is near the end but maybe not strictly endswith('.')
            # e.g., ." or .) or . followed by spaces
            m = re.search(r'\.[^a-zA-Z0-9]*$', obj)
            if m and not obj.endswith('...') and not obj.endswith('.jpg') and not obj.endswith('.png'):
                res.append((path, obj))
        return res
    
    matches = walk(data)
    print(f'{lang}: total near-end dot matches: {len(matches)}')
    for p, s in matches:
        if not s.endswith('.'):
            print(f'  Special: {p}: {repr(s)}')
