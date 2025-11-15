#!/bin/bash

# Security Check Script for Centrion Blog
# Checks for common security issues before deployment

set -e

echo "🔒 Centrion Blog - Security Check"
echo "=================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: Sensitive data in git
echo "🔍 Checking for sensitive data..."
if git ls-files | grep -E '\.(env|key|pem|crt|pfx)$' > /dev/null 2>&1; then
    echo -e "${RED}✗ FAIL: Sensitive files found in git${NC}"
    git ls-files | grep -E '\.(env|key|pem|crt|pfx)$'
    ((ERRORS++))
else
    echo -e "${GREEN}✓ PASS: No sensitive files in git${NC}"
fi

# Check 2: Security headers file exists
echo ""
echo "🔍 Checking security headers..."
if [ -f "static/_headers" ]; then
    echo -e "${GREEN}✓ PASS: Security headers file exists${NC}"
else
    echo -e "${RED}✗ FAIL: Security headers file missing${NC}"
    ((ERRORS++))
fi

# Check 3: HTTPS enforcement
echo ""
echo "🔍 Checking HTTPS enforcement..."
if [ -f "netlify.toml" ] && grep -q "https://" netlify.toml; then
    echo -e "${GREEN}✓ PASS: HTTPS redirects configured${NC}"
else
    echo -e "${YELLOW}⚠ WARNING: HTTPS redirects not found${NC}"
    ((WARNINGS++))
fi

# Check 4: Security.txt exists
echo ""
echo "🔍 Checking security.txt..."
if [ -f "static/.well-known/security.txt" ]; then
    echo -e "${GREEN}✓ PASS: security.txt exists${NC}"
else
    echo -e "${YELLOW}⚠ WARNING: security.txt missing${NC}"
    ((WARNINGS++))
fi

# Check 5: Robots.txt exists
echo ""
echo "🔍 Checking robots.txt..."
if [ -f "static/robots.txt" ]; then
    echo -e "${GREEN}✓ PASS: robots.txt exists${NC}"
else
    echo -e "${YELLOW}⚠ WARNING: robots.txt missing${NC}"
    ((WARNINGS++))
fi

# Check 6: Hugo security settings
echo ""
echo "🔍 Checking Hugo security configuration..."
if grep -q "security:" hugo.yaml; then
    echo -e "${GREEN}✓ PASS: Hugo security settings configured${NC}"
else
    echo -e "${RED}✗ FAIL: Hugo security settings missing${NC}"
    ((ERRORS++))
fi

# Check 7: Check for hardcoded secrets
echo ""
echo "🔍 Checking for hardcoded secrets..."
if grep -rE '(password|secret|api[_-]?key|token|bearer|auth).*=.*["\047][^"\047]{8,}["\047]' --include="*.yaml" --include="*.toml" --include="*.html" --exclude-dir=public --exclude-dir=themes . > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ WARNING: Possible hardcoded secrets found${NC}"
    echo "  Run manual review of configuration files"
    ((WARNINGS++))
else
    echo -e "${GREEN}✓ PASS: No obvious hardcoded secrets${NC}"
fi

# Check 8: Dependencies vulnerability (if npm exists)
if command -v npm &> /dev/null; then
    echo ""
    echo "🔍 Checking npm dependencies..."
    if [ -f "package.json" ]; then
        if npm audit --audit-level=high > /dev/null 2>&1; then
            echo -e "${GREEN}✓ PASS: No high-severity npm vulnerabilities${NC}"
        else
            echo -e "${YELLOW}⚠ WARNING: npm vulnerabilities detected${NC}"
            echo "  Run 'npm audit' for details"
            ((WARNINGS++))
        fi
    fi
fi

# Summary
echo ""
echo "=================================="
echo "📊 Security Check Summary"
echo "=================================="
echo -e "Errors:   ${RED}${ERRORS}${NC}"
echo -e "Warnings: ${YELLOW}${WARNINGS}${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ Security check failed! Fix errors before deploying.${NC}"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Security check passed with warnings.${NC}"
    echo "Consider fixing warnings for better security."
    exit 0
else
    echo -e "${GREEN}✅ All security checks passed!${NC}"
    exit 0
fi
