<?php
return [
    'Permissions' => [
        'noAuth' => [
            'Users' => ['getToken', 'passwordReminder', 'login', 'requestResetPassword'],
        ],
        'superuser' => '*',
        'user' => [
            'Companies' => ['accessible', 'index', 'setDefault'],
            'Invoices' => ['add', 'billingo', 'edit', 'index', 'import', 'view'],
            'Invoicetypes' => ['index'],
            'Groups' => ['index'],
            'Partners' => ['add', 'edit', 'index'],
            'Partnersgroups' => ['index'],
            'Products' => ['stock', 'add', 'edit', 'index', 'view'],
            'Stats' => ['index'],
            'Storages' => ['index'],
        ]
    ]
];
