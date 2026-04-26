@props(['url', 'message' => null])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@php
    $logoPath = public_path('billifty.png');
    $logoAsset = asset('billifty.png');
    $logoSrc = isset($message) && $logoPath ? $message->embed($logoPath) : $logoAsset;
@endphp
<img
    src="{{ $logoSrc }}"
    class="logo"
    alt="Billifty Logo"
    style="display: block; max-width: 220px; height: auto; margin: 0 auto;"
>
</a>
</td>
</tr>
