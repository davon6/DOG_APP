#ifndef CHAR_TRAITS_FIX_H
#define CHAR_TRAITS_FIX_H

#include <string>

namespace std {
  template <>
  struct char_traits<unsigned char> : char_traits<char> {};
}

#endif
