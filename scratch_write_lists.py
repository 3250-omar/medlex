import sys, json
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
            if obj.endswith('.') and not obj.endswith('...') and not obj.endswith('.jpg') and not obj.endswith('.png'):
                res.append((path, obj))
        return res
    
    matches = walk(data)
    with open(f'scratch_{lang}_list.txt', 'w', encoding='utf-8') as out:
        for p, s in matches:
            out.write(f'{p} | {s}\n')

print('Done writing lists')
