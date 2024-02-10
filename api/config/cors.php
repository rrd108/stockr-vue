<?php
return [
  'Cors' => [
    'AllowOrigin' => ['http://localhost:5173', 'https://stockr.1108.cc'],
    'AllowMethods' => ['GET', 'POST', 'PATCH', 'OPTIONS', 'DELETE', 'PUT'],
    'AllowHeaders' => ['Token', 'Content-Type'],
    'MaxAge' => 300,
  ]
];
