#!/bin/bash

# Nazariy Avtotest — Setup Script
# Bu script barcha komponentlarni setup qiladi

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║       Nazariy Avtotest — Setup Script                      ║"
echo "║       Barcha komponentlarni o'rnatish uchun                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_step "Prerequisitlarni tekshirish..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js o'rnatilmagan"
        exit 1
    fi
    print_success "Node.js $(node --version)"

    if ! command -v npm &> /dev/null; then
        print_error "npm o'rnatilmagan"
        exit 1
    fi
    print_success "npm $(npm --version)"

    echo ""
}

# Setup Backend
setup_backend() {
    print_step "Backend o'rnatish..."

    if [ ! -d "nazariy-backend" ]; then
        print_error "nazariy-backend papkasi topilmadi"
        return 1
    fi

    cd nazariy-backend

    # Copy .env
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_success ".env fayli yaratildi"
        print_warning "❗ .env faylini o'zingizning qiymatlaringiz bilan to'ldiring!"
    else
        print_warning ".env fayli allaqachon mavjud"
    fi

    # Install dependencies
    print_step "Dependencies o'rnatish..."
    npm install 2>&1 | grep -E "(added|up to date)" || true
    print_success "Dependencies o'rnatildi"

    cd ..
    echo ""
}

# Setup Web Frontend
setup_web() {
    print_step "Web Frontend o'rnatish..."

    if [ ! -d "nazariy-web" ]; then
        print_error "nazariy-web papkasi topilmadi"
        return 1
    fi

    cd nazariy-web

    # Copy .env
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_success ".env fayli yaratildi"
        print_warning "❗ VITE_API_URL'ni yangilang!"
    else
        print_warning ".env fayli allaqachon mavjud"
    fi

    # Install dependencies
    print_step "Dependencies o'rnatish..."
    npm install 2>&1 | grep -E "(added|up to date)" || true
    print_success "Dependencies o'rnatildi"

    # Test build
    print_step "Build test..."
    npm run build > /dev/null 2>&1 && print_success "Build muvaffaqiyatli" || print_warning "Build jarayonida xato"

    cd ..
    echo ""
}

# Summary
print_summary() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║              ✓ Setup Muvaffaqiyatli!                       ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo -e "${BLUE}Keyingi qadamlar:${NC}"
    echo ""
    echo "1. Backend .env'ni to'ldiring:"
    echo "   ${YELLOW}nano nazariy-backend/.env${NC}"
    echo ""
    echo "2. Web Frontend .env'ni to'ldiring:"
    echo "   ${YELLOW}nano nazariy-web/.env${NC}"
    echo ""
    echo "3. Backend'ni ishga tushiring:"
    echo "   ${YELLOW}cd nazariy-backend && npm run dev${NC}"
    echo ""
    echo "4. Web Frontend'ni ishga tushiring (yangi terminal):"
    echo "   ${YELLOW}cd nazariy-web && npm run dev${NC}"
    echo ""
    echo "5. Docker bilan ishlatish:"
    echo "   ${YELLOW}docker-compose up${NC}"
    echo ""
    echo "📚 Qo'shimcha ma'lumot:"
    echo "   • README.md — Loyiha haqida"
    echo "   • DEPLOYMENT.md — Deploy qo'llanmasi"
    echo "   • PRODUCTION-CHECKLIST.md — Production checklist"
    echo ""
}

# Main
main() {
    check_prerequisites

    print_step "Setup boshlash..."
    echo ""

    setup_backend
    setup_web

    print_summary
}

# Run
main
