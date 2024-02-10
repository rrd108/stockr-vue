<?php
return [
    'Permissions' => [
        'noAuth' => [
            'Users' => ['getToken', 'passwordReminder'],
        ],
        'superuser' => '*',
        'user' => [
            'Companies' => ['accessible', 'index', 'setDefault'],
            'Invoices' => ['add', 'billingo', 'edit', 'index', 'import', 'view'],
            'Partners' => ['add', 'edit', 'index'],
            'Products' => ['stock', 'add', 'edit', 'index', 'view']
        ]
    ]
];
