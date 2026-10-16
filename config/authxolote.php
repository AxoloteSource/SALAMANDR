<?php

return [
    /*
    |--------------------------------------------------------------------------
    | URL Configuration
    |--------------------------------------------------------------------------
    |
    | This option defines the URL for the Authxolote API.
    | You can set it in the environment file using the variable AUTHXOLOTE_URL.
    | If not set, it defaults to 'https://api.ejemplo.com'.
    |
    */
    'url' => env('AUTHXOLOTE_URL', 'https://api.ejemplo.com'),

    /*
     |--------------------------------------------------------------------------
     | Authentication Token
     |--------------------------------------------------------------------------
     |
     | This option defines the token used to authenticate requests to the
     | Authxolote API. Set it in the environment file using the variable
     | AUTHXOLOTE_TOKEN. Leave it blank to disable token-based authentication.
     |
     */
    'token' => env('AUTHXOLOTE_TOKEN', ''),

    /*
    |--------------------------------------------------------------------------
    | Caching
    |--------------------------------------------------------------------------
    |
    | This option controls whether caching is enabled for the application.
    | When enabled, responses and data can be cached to improve performance
    | Set to true to enable caching or false to disable it.
    |
    */
    'cache' => env('AUTHXOLOTE_CACHE', true),

    /*
    |--------------------------------------------------------------------------
    | Debug Mode
    |--------------------------------------------------------------------------
    |
    | This option controls whether debug mode is enabled.
    | When enabled, logs will be printed for debugging purposes.
    | Set to true to enable debug logging or false to disable it.
    |
    */
    'debug' => env('AUTHXOLOTE_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | Sync User with Database
    |--------------------------------------------------------------------------
    |
    | This option controls whether the user should be looked up in the local
    | database or if the data from the Authxolote API should be used directly.
    | Set to true to search in the database, false to use API data.
    |
    */
    'sync_user' => env('AUTHXOLOTE_SYNC_USER', true),

    /*
    |--------------------------------------------------------------------------
    | Menu Configuration
    |--------------------------------------------------------------------------
    |
    | This option defines the unified SALAMANDR menu to be synced with the
    | Authxolote API. Use `php artisan authxolote:menu` to sync it.
    |
    | Menu item slugs are the array keys, and Authxolote enforces GLOBAL
    | uniqueness across every menu, so each key is namespaced with the
    | `salamandr-` prefix (mirrors the `rewards-` prefix on axolote-rewards).
    | `path`/`name`/`icon`/`roles` keep their original values.
    |
    */
    'menu' => [
        'name' => 'salamandr',
        'application' => [
            'name' => 'Salamandr',
            'slug' => 'salamandr',
            'description' => 'Salamandr',
        ],
        'menu_items' => [
            'salamandr-home' => [
                'type' => 'link',
                'path' => '/',
                'icon' => 'House',
                'roles' => ['root', 'admin'],
            ],
            'salamandr-auth' => [
                'icon' => 'Shield',
                'roles' => ['root', 'admin'],
                'menu_items' => [
                    'salamandr-auth-user-lists' => [
                        'path' => '/auth/user-lists',
                        'icon' => 'UserPlus',
                        'name' => 'user_lists',
                    ],
                    'salamandr-auth-users' => [
                        'path' => '/auth/users',
                        'icon' => 'Users',
                        'name' => 'users',
                    ],
                    'salamandr-auth-applications' => [
                        'path' => '/auth/applications',
                        'icon' => 'AppWindow',
                        'name' => 'applications',
                    ],
                    'salamandr-auth-catalogs' => [
                        'icon' => 'Database',
                        'name' => 'menu.catalogs',
                        'menu_items' => [
                            'salamandr-auth-catalogs-roles' => [
                                'path' => '/auth/catalogs/roles',
                                'name' => 'Roles',
                            ],
                            'salamandr-auth-catalogs-role-actions' => [
                                'path' => '/auth/catalogs/roles/actions',
                                'name' => 'Acciones',
                            ],
                        ],
                    ],
                    'salamandr-auth-menus' => [
                        'icon' => 'ListTree',
                        'name' => 'menu.menus',
                        'menu_items' => [
                            'salamandr-auth-menus-items' => [
                                'path' => '/auth/menus',
                                'name' => 'Menus',
                            ],
                        ],
                    ],
                    'salamandr-auth-ui' => [
                        'icon' => 'Palette',
                        'name' => 'UI Components',
                        'menu_items' => [
                            'salamandr-auth-ui-pricing-card' => [
                                'path' => '/auth/ui/pricing-card',
                                'name' => 'Pricing Card',
                            ],
                        ],
                    ],
                ],
            ],
            'salamandr-messages' => [
                'icon' => 'MessageSquare',
                'roles' => ['root', 'admin'],
                'menu_items' => [
                    'salamandr-messages-whatsapp' => [
                        'icon' => 'ScrollText',
                        'menu_items' => [
                            'salamandr-messages-whatsapp-templates' => [
                                'path' => '/messages/whatsapp-templates',
                                'icon' => 'MessageSquare',
                                'name' => 'whatsapp_templates',
                            ],
                            'salamandr-messages-whatsapp-chats' => [
                                'path' => '/messages/whatsapp/chats',
                                'icon' => 'MessagesSquare',
                                'name' => 'whatsapp_chats',
                            ],
                            'salamandr-messages-whatsapp-info' => [
                                'path' => '/messages/whatsapp-info',
                                'icon' => 'Info',
                                'name' => 'whatsapp_info',
                            ],
                        ],
                    ],
                    'salamandr-messages-email' => [
                        'icon' => 'AtSign',
                        'menu_items' => [
                            'salamandr-messages-email-templates' => [
                                'path' => '/messages/emails',
                                'icon' => 'Mail',
                                'name' => 'email_templates',
                            ],
                        ],
                    ],
                    'salamandr-messages-push-notifications' => [
                        'icon' => 'MessageSquareWarning',
                        'menu_items' => [
                            'salamandr-messages-push-notifications-bell' => [
                                'path' => '/messages/push-notifications',
                                'icon' => 'Bell',
                                'name' => 'push_notifications',
                            ],
                        ],
                    ],
                    'salamandr-messages-campaigns' => [
                        'path' => '/messages/campaigns',
                        'icon' => 'Megaphone',
                        'name' => 'campaigns',
                    ],
                    'salamandr-messages-ui' => [
                        'path' => '/messages/ui',
                        'icon' => 'Code2',
                        'name' => 'ui',
                    ],
                ],
            ],
        ],
    ],
];
