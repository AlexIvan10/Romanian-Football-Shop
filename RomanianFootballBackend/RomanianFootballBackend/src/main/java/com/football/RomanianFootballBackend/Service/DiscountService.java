package com.football.RomanianFootballBackend.Service;

import com.football.RomanianFootballBackend.Entity.Discount;
import com.football.RomanianFootballBackend.Repository.DiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiscountService {
    @Autowired
    private DiscountRepository discountRepository;

    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    public Discount getDiscountById(int id) {
        return discountRepository.findById(id).orElse(null);
    }

    public Discount findByCode(String code) {
        return discountRepository.findByCode(code).orElse(null);
    }

    public Discount addDiscount(Discount discount) {
        return discountRepository.save(discount);
    }

    public Discount updateDiscount(int id, Discount updatedDiscount) {
        return discountRepository.findById(id)
                .map(existingDiscount -> {
                    if (updatedDiscount.getCode() != null) {
                        existingDiscount.setCode(updatedDiscount.getCode());
                    }
                    if (updatedDiscount.getDiscountPercentage() != null) {
                        existingDiscount.setDiscountPercentage(updatedDiscount.getDiscountPercentage());
                    }
                    if (updatedDiscount.getActive() != null) {
                        existingDiscount.setActive(updatedDiscount.getActive());
                    }
                    return discountRepository.save(existingDiscount);
                })
                .orElse(null);
    }

    public Discount markDiscountAsUsed(int id) {
        return discountRepository.findById(id)
                .map(discount -> {
                    discount.setActive(false);
                    return discountRepository.save(discount);
                })
                .orElse(null);
    }

    public void deleteDiscount(int id) {
        discountRepository.deleteById(id);
    }
}
